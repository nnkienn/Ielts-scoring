import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CreditService {
  constructor(
    private prismaService: PrismaService,
  ) { }

  async hasCredits(userId: number): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { freeCredits: true, paidCredits: true },
    });
    if (!user) throw new Error('User not found');
    return user.freeCredits > 0 || user.paidCredits > 0;
  }

  async decrementCredits(userId: number): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: { freeCredits: true, paidCredits: true }
    }
    );
    if (!user) throw new Error('User not found');
    if (user.freeCredits > 0) {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { freeCredits: { decrement: 1 } }
      })
    } else {
      throw new Error('No credits available');
    }
  }

  async grantCredits(userId: number, credits: number): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { paidCredits: { increment: credits } }
    });
  }

  async getCredits(userId : number){
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: { freeCredits: true, paidCredits: true },
    });
  }

}
