import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/decorators/jwt.guard';
import { RolesGuard } from './common/decorators/roles.guard';
import { AdminModule } from './admin/admin.module';
import { RedisService } from './config/redis.service';
import { TranslateModule } from './translate/translate.module';
import { RabbitMQService } from './config/rabbitmq.service';
import { EssayModule } from './essay/essay.module';
import { EssayProcessor } from './essay/essay.processor';
import { PaymentModule } from './payment/payment.module';
import { CreditModule } from './credit/credit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // 👈 load env theo NODE_ENV
    }),
    JwtModule.register({}),
    UsersModule,
    AuthModule,
    RolesModule,
    AdminModule,
    TranslateModule,
    EssayModule,
    PaymentModule,
    CreditModule,
  ],
  controllers: [AppController],
  providers: [
    EssayProcessor,
    RabbitMQService,
    RedisService,
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: JwtGuard },   // chạy TRƯỚC
    { provide: APP_GUARD, useClass: RolesGuard }, // chạy SAU
  ],
})
export class AppModule {}
