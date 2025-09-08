import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TranslateService } from './translate.service';
import { JwtGuard } from '../common/decorators/jwt.guard';
import { GetUser } from 'src/common/guard/get-user.decorator';


@Controller('translate')
export class TranslateController {
  constructor(private readonly translateService: TranslateService) { }
  @Post()
  @UseGuards(JwtGuard)
  async translateText(
    @Body('text') text: string,
    @Body('source') source: string,
    @Body('target') target: string,
    @GetUser('sub') userId: number   // nếu bạn vẫn để nguyên payload
  ) {
    console.log('User ID:',userId); // Log the user ID to verify it's being received correctly
    return this.translateService.translateText(text, source, target, userId);
  }

}
