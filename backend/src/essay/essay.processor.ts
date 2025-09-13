import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class EssayProcessor {
  private readonly logger = new Logger(EssayProcessor.name);

  constructor(private prisma: PrismaService) {}

  async processEssay(essayId: number, text: string, taskType: string) {
    try {
      // 🔹 gọi AI service Python
      const res = await axios.post(
        process.env.AI_URL || 'http://localhost:8000/grade',
        { text, taskType },
        { headers: { 'x-ai-secret': process.env.AI_SECRET } },
      );

      const grading = res.data;

      // 🔹 lưu vào DB
      await this.prisma.aIGrading.upsert({
        where: { submissionId: essayId },
        update: {
          overallBand: grading.overallBand,
          taskResponse: grading.taskResponse,
          coherenceCohesion: grading.coherenceCohesion,
          lexicalResource: grading.lexicalResource,
          grammaticalRange: grading.grammaticalRange,
          feedback: grading.feedback,
          annotations: grading.annotations,
          vocabulary: grading.vocabulary,
          sentenceTips: grading.sentenceTips,
          structureTips: grading.structureTips,
          meta: grading.meta,
        },
        create: {
          submissionId: essayId,
          overallBand: grading.overallBand,
          taskResponse: grading.taskResponse,
          coherenceCohesion: grading.coherenceCohesion,
          lexicalResource: grading.lexicalResource,
          grammaticalRange: grading.grammaticalRange,
          feedback: grading.feedback,
          annotations: grading.annotations,
          vocabulary: grading.vocabulary,
          sentenceTips: grading.sentenceTips,
          structureTips: grading.structureTips,
          meta: grading.meta,
        },
      });

      await this.prisma.essaySubmission.update({
        where: { id: essayId },
        data: { status: 'DONE' },
      });

      this.logger.log(`✅ Essay ${essayId} graded & saved`);
    } catch (err) {
      this.logger.error(`❌ Failed to process essay ${essayId}`, err);
    }
  }
}
