import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import axios from 'axios';
import { EssayGateway } from './essay.gateway';

@Injectable()
export class EssayProcessor {
  private readonly logger = new Logger(EssayProcessor.name);

  constructor(
    private prisma: PrismaService,
    private essayGateway: EssayGateway,
  ) {}

  async processEssay(essayId: number, text: string, taskType: string) {
    try {
      this.logger.log(`📥 Start processing essay ${essayId}`);

      const res = await axios.post(
        process.env.AI_URL || 'http://localhost:8000/grade',
        { text, taskType },
        { headers: { 'x-ai-secret': process.env.AI_SECRET } },
      );

      this.logger.log(`✅ AI service responded for essay ${essayId}`);
      this.logger.debug(JSON.stringify(res.data, null, 2));

      const grading = res.data;

      await this.prisma.aIGrading.upsert({
        where: { submissionId: essayId },
        update: grading,
        create: { submissionId: essayId, ...grading },
      });

      await this.prisma.essaySubmission.update({
        where: { id: essayId },
        data: { status: 'DONE' },
      });

      const updatedEssay = await this.prisma.essaySubmission.findUnique({
        where: { id: essayId },
        include: { grading: true, prompt: true },
      });

      this.logger.log(`📤 About to emit essay_update_${essayId}`);
      this.essayGateway.notifyEssayUpdated(essayId, updatedEssay);

      this.logger.log(`✅ Essay ${essayId} graded & emitted`);
    } catch (err) {
      this.logger.error(`❌ Failed to process essay ${essayId}`, err as any);
      await this.prisma.essaySubmission.update({
        where: { id: essayId },
        data: { status: 'FAILED' },
      });
      const failEssay = await this.prisma.essaySubmission.findUnique({
        where: { id: essayId },
        include: { grading: true, prompt: true },
      });
      this.essayGateway.notifyEssayUpdated(essayId, failEssay);
    }
  }
}
