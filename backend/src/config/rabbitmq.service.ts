import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(process.env.RABBITMQ_QUEUE, { durable: true });
    console.log('✅ Connected to RabbitMQ');
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async publish(message: any) {
    this.channel.sendToQueue(
      process.env.RABBITMQ_QUEUE,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }

  async consume(handler: (msg: any) => Promise<void>) {
    await this.channel.consume(process.env.RABBITMQ_QUEUE, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        try {
          await handler(content);
          this.channel.ack(msg);
        } catch (err) {
          console.error('❌ Error handling message', err);
          this.channel.nack(msg, false, true); // requeue
        }
      }
    });
  }
}
