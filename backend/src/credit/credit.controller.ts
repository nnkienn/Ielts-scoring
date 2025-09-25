import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreditService } from './credit.service';

import { JwtGuard } from 'src/common/decorators/jwt.guard';
import { GetUser } from 'src/common/guard/get-user.decorator';

@Controller('credits')
export class CreditController {
  constructor(private readonly creditService: CreditService) { }
  @UseGuards(JwtGuard)
  @Get('me')
  async getMyCredits(@GetUser('sub') userId: number) {
    return this.creditService.getCredits(userId);
  }
}
