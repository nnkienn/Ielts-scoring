// src/credit/credit.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CreditService {
  constructor(private prisma: PrismaService) {}

  async hasCredits(userId: number): Promise<boolean> {
    const u = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { freeCredits: true, paidCredits: true },
    });
    if (!u) throw new NotFoundException('User not found');
    return (u.freeCredits ?? 0) > 0 || (u.paidCredits ?? 0) > 0;
  }

  /**
   * Trừ 1 credit: ưu tiên freeCredits, hết free thì trừ paidCredits.
   * Nếu hết cả 2 -> ném 402 để FE hiện paywall (không phải 500).
   */
  async decrementCredits(userId: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const u = await tx.user.findUnique({
        where: { id: userId },
        select: { freeCredits: true, paidCredits: true },
      });
      if (!u) throw new NotFoundException('User not found');

      if ((u.freeCredits ?? 0) > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { freeCredits: { decrement: 1 } },
        });
        return;
      }

      if ((u.paidCredits ?? 0) > 0) {
        await tx.user.update({
          where: { id: userId },
          data: { paidCredits: { decrement: 1 } },
        });
        return;
      }

      // Hết sạch credit -> trả 402 Payment Required (FE của bạn đã bỏ qua refresh cho 402)
      throw new HttpException('Insufficient credits', HttpStatus.PAYMENT_REQUIRED);
    });
  }

  async grantCredits(userId: number, credits: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { paidCredits: { increment: credits } },
    });
  }

  async getCredits(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { freeCredits: true, paidCredits: true },
    });
  }
}
