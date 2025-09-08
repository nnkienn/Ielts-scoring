import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RedisService } from 'src/redis.service';
import axios from 'axios';
import { OpenAIService } from 'src/openai.service';

@Injectable()
export class TranslateService {
  constructor(private readonly prismaService: PrismaService, private readonly redisService: RedisService ,private openaiService: OpenAIService) { }

  async translateText(text: string, source: string, target: string, userId?: number) {
const redis = this.redisService.getClient();
    const cacheKey = `translate:${source}:${target}:${text}`;

    // 1. Check cache
    const cached = await redis.get(cacheKey);
    if (cached) return { translatedText: cached, fromCache: true };

    // 2. Gọi OpenAI
    const translatedText = await this.openaiService.translate(text, target);

    // 3. Save cache + DB
    await redis.set(cacheKey, translatedText, 'EX', 60 * 60 * 24); // cache 24h
    await this.prismaService.translation.create({
      data: { userId, sourceLang: source, targetLang: target, originalText: text, translatedText, fromCache: false },
    });

    return { translatedText, fromCache: false };
  }

}


