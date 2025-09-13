import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { JwtGuard } from '../common/decorators/jwt.guard';
import { GetUser } from 'src/common/guard/get-user.decorator';

@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) {}

  // 🔹 API dịch text
  @UseGuards(JwtGuard)
  @Post()
  async translate(
    @GetUser('sub') userId: number,
    @Body() body: { text: string; source: string; target: string },
  ) {
    return this.translateService.translateText(
      body.text,
      body.source,
      body.target,
      userId,
    );
  }

  // 🔹 Lấy lịch sử dịch của user
  @UseGuards(JwtGuard)
  @Get('history')
  async getHistory(@GetUser('sub') userId: number) {
    return this.translateService['prismaService'].translation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }
}
