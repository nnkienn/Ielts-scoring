import { Module } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { TranslateController } from './translate.controller';
import { PrismaService } from 'prisma/prisma.service';
import { RedisService } from 'src/redis.service';
import { OpenAIService } from 'src/openai.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule], // 👈 thêm cái này
  controllers: [TranslateController],
  providers: [TranslateService , PrismaService , RedisService,OpenAIService],
})
export class TranslateModule {}
