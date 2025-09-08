import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async translate(text: string, target: string = 'vi'): Promise<string> {
    const res = await this.client.chat.completions.create({
      model: 'gpt-4o-mini', // rẻ và nhanh
      messages: [
        {
          role: 'system',
          content: `You are a translation engine. Translate everything into ${target}. Only return the translated text.`,
        },
        { role: 'user', content: text },
      ],
    });

    return res.choices[0].message.content ?? '';
  }
}
