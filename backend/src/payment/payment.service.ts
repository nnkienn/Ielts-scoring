import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import Stripe from 'stripe';
import type { Request, Response } from 'express';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      throw new Error('❌ STRIPE_SECRET_KEY is not defined in .env');
    }

    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2025-08-27.basil',
    });
  }

  async createPlan(data: { name: string; price: number; credits: number; stripePriceId: string }) {
    return this.prisma.plan.create({ data });
  }

  async getAllPlans() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async decativePlan(id: number) {
    return this.prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async createCheckoutSession(
    userId: number,
    priceId: string,
    planId: number,
  ): Promise<{ url: string }> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/cancel`,
      metadata: {
        userId: String(userId),
        planId: String(planId),
      },
    });

    return { url: session.url! };
  }

  async getSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  async getUserpayment(userId : number) {
    return this.prisma.payment.findMany({
      where :{userId},
      orderBy : {createdAt :'desc'},
      include:{
        plan : true
      }
    })
  }

  // ✅ Xử lý webhook
  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = this.stripe.webhooks.constructEvent(
        req.body as Buffer, // 👈 dùng thẳng req.body
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );

      console.log('✅ Event type:', event.type);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = Number(session.metadata?.userId);
        const planId = Number(session.metadata?.planId);

        if (!userId || !planId) {
          console.error('⚠️ Missing metadata in session');
          return res.status(400).send('Missing metadata');
        }

        // 1️⃣ tìm plan trong DB
        const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
        if (!plan) return res.status(400).send('Plan not found');

        // 2️⃣ lưu payment
        await this.prisma.payment.create({
          data: {
            userId,
            planId,
            stripeId: session.id,
            amount: plan.price,
            currency: 'usd',
            status: 'succeeded',
          },
        });

        // 3️⃣ cộng credits
        await this.prisma.user.update({
          where: { id: userId },
          data: { paidCredits: { increment: plan.credits } },
        });

        console.log(`✅ User ${userId} credited +${plan.credits}`);
      }

      return res.send({ received: true });
    } catch (err: any) {
      console.error('❌ Webhook error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
