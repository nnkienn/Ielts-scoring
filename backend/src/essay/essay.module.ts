import { Module } from '@nestjs/common';
import { EssayService } from './essay.service';
import { EssayController } from './essay.controller';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { RabbitMQService } from 'src/config/rabbitmq.service';
import { JwtService } from '@nestjs/jwt';
import { EssayProcessor } from './essay.processor';
import { RedisService } from 'src/config/redis.service';
import { EssayGateway } from './essay.gateway';
import { CreditService } from 'src/credit/credit.service';

@Module({
  controllers: [EssayController],
  providers: [
    EssayService,
    PrismaService,
    UsersService,
    RabbitMQService,
    JwtService,
    EssayProcessor,
    RedisService,
    EssayGateway,
    CreditService
  ],
  exports: [EssayService, EssayGateway], // export để chỗ khác dùng
})
export class EssayModule { }
