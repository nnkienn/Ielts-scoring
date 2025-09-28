import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GetUser } from 'src/common/guard/get-user.decorator';
import { JwtGuard } from 'src/common/decorators/jwt.guard';
import { Roles } from 'src/common/guard/roles.decorator';

// Dùng import type để tránh lỗi TS1272
import type { Request, Response } from 'express';
import type { RawBodyRequest } from '@nestjs/common';
import { Public } from 'src/common/guard/public.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  // ------------------ ADMIN ------------------
  @Post('plans')
  @Roles('Admin')
  async createPlan(
    @GetUser('sub') userId: number,
    @Body()
    body: { name: string; price: number; credits: number; stripePriceId: string },
  ) {
    return this.paymentService.createPlan(body);
  }

  @UseGuards(JwtGuard)
  @Get('history')
  async getUserPayments(@GetUser('sub') userId: number) {
    return this.paymentService.getUserpayment(userId);
  }


  @Get('plans')
  async getAllPlans() {
    return this.paymentService.getAllPlans();
  }

  @Patch('plans/:id/deactive')
  async decativePlan(@Param('id') id: string) {
    return this.paymentService.decativePlan(Number(id));
  }

  // ------------------ USER ------------------
  @UseGuards(JwtGuard)
  @Post('checkout')
  async createCheckoutSession(
    @GetUser('sub') userId: number,
    @Body('priceId') priceId: string,
    @Body('planId') planId: number,   // 👈 nhận thêm planId từ body
  ): Promise<{ url: string }> {
    return this.paymentService.createCheckoutSession(userId, priceId, planId);
  }


  @Get('session')
  async getSession(@Query('sessionId') sessionId: string) {
    return this.paymentService.getSession(sessionId);
  }

  // ------------------ STRIPE WEBHOOK ------------------
  @Post('webhook')
  @Public()
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    // truyền req/res sang service
    return this.paymentService.handleWebhook(req, res);
  }
}
