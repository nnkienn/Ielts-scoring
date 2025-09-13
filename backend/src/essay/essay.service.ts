import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'prisma/prisma.service';
import { RabbitMQService } from 'src/config/rabbitmq.service';
import { EssayStatus } from '@prisma/client';
import { RedisService } from 'src/config/redis.service';

@Injectable()
export class EssayService {
  constructor(
    private userService: UsersService,
    private prismaService: PrismaService,
    private rabbitMQService: RabbitMQService,
    private redisService: RedisService,
  ) { }

  // 🔹 Helper: check hoặc tạo Prompt
  private async getOrCreatePrompt(data: { promptId?: number; question?: string; taskType?: string }) {
    if (data.promptId) {
      const prompt = await this.prismaService.prompt.findUnique({
        where: { id: data.promptId },
      });
      if (!prompt) throw new Error('Prompt not found');
      return prompt;
    }

    if (!data.question || !data.taskType) {
      throw new Error('Missing prompt data');
    }

    return await this.prismaService.prompt.upsert({
      where: {
        question_taskType: { question: data.question, taskType: data.taskType },
      },
      update: {},
      create: {
        question: data.question,
        taskType: data.taskType,
      },
    });
  }
  private async hashText(text: string): Promise<string> {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  async submitEssay(
    userId: number,
    data: { promptId?: number; question?: string; taskType?: string; text: string },
  ) {
    const redis = this.redisService.getClient();

    // 1. check credits
    const hasCredits = await this.userService.hasCredits(userId);
    if (!hasCredits) throw new Error('Insufficient credits');

    // 2. hash text
    const hash = this.hashText(data.text);
    const cacheKey = `essay:${userId}:${hash}`;

    // 3. check redis
    const cachedEssayId = await redis.get(cacheKey);
    if (cachedEssayId) {
      // 🔄 nếu đã có -> trả lại luôn
      const essay = await this.prismaService.essaySubmission.findUnique({
        where: { id: Number(cachedEssayId) },
        include: { grading: true, prompt: true },
      });
      return {
        ...essay,
        reused: true,
      };
    }

    // 4. decrement credits
    await this.userService.decrementCredits(userId);

    // 5. check/create prompt
    const prompt = await this.getOrCreatePrompt(data);

    // 6. create essay
    const essay = await this.prismaService.essaySubmission.create({
      data: {
        userId,
        promptId: prompt.id,
        text: data.text,
        status: EssayStatus.PENDING,
      },
    });

    // 7. set cache (timeout 24h)
    await redis.set(cacheKey, essay.id, 'EX', 60 * 60 * 24);

    // 8. publish to RabbitMQ
    await this.rabbitMQService.publish({
      essayId: essay.id,
      text: data.text,
      taskType: prompt.taskType,
      promptId: prompt.id,
    });

    return { essayId: essay.id, status: essay.status.toLowerCase(), reused: false };
  }

  // 🔹 Get essay (check quyền)
  async getEssay(essayId: number, userId: number) {
    const essay = await this.prismaService.essaySubmission.findUnique({
      where: { id: essayId },
      include: { grading: true, prompt: true, user: { include: { role: true } } },
    });

    if (!essay) throw new Error('Essay not found');

    // ✅ chỉ owner hoặc admin mới được xem
    if (essay.userId !== userId && essay.user.role.name !== 'admin') {
      throw new Error('Access denied');
    }

    return {
      ...essay,
      isGraded: !!essay.grading,
      status: essay.status.toLowerCase(),
      reused: false, // mặc định essay get bằng id không reuse
    };
  }

  async listEssays(userId: number) {
  return this.prismaService.essaySubmission.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { prompt: true, grading: true },
  });
}

async deleteEssay(essayId: number, userId: number) {
  const essay = await this.prismaService.essaySubmission.findUnique({ where: { id: essayId } });
  if (!essay) throw new Error('Essay not found');
  if (essay.userId !== userId) throw new Error('Access denied');
  if (essay.status !== EssayStatus.PENDING) throw new Error('Cannot delete graded essay');

  return this.prismaService.essaySubmission.delete({ where: { id: essayId } });
}
async retryGrading(essayId: number, userId: number) {
  const essay = await this.prismaService.essaySubmission.findUnique({ 
    where: { id: essayId },
    include: { prompt: true }
  });
  if (!essay) throw new Error('Essay not found');
  if (essay.userId !== userId) throw new Error('Access denied');

  await this.rabbitMQService.publish({
    essayId: essay.id,
    text: essay.text,
    taskType: essay.prompt.taskType,
    promptId: essay.promptId,
  });

  await this.prismaService.essaySubmission.update({
    where: { id: essayId },
    data: { status: EssayStatus.PENDING },
  });

  return { message: 'Essay sent for re-grading' };
}
async checkDuplicateEssay(text: string) {
  const essay = await this.prismaService.essaySubmission.findFirst({
    where: { text },
    include: { grading: true },
  });

  if (essay && essay.grading) {
    return { duplicate: true, essayId: essay.id, grading: essay.grading };
  }
  return { duplicate: false };
}



}