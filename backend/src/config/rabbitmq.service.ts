import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import amqp, { Connection, Channel } from 'amqplib';
import { EssayProcessor } from 'src/essay/essay.processor';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);

  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queue = process.env.RABBITMQ_QUEUE || 'essay_grading';

  constructor(private essayProcessor: EssayProcessor) {}

  async onModuleInit() {
    await this.connect();
    await this.consume(); // 👈 worker chạy tự động khi app khởi động
  }

  private async connect(retry = 5) {
    const url = process.env.RABBITMQ_URL;
    if (!url) throw new Error('RABBITMQ_URL not defined');

    for (let attempt = 1; attempt <= retry; attempt++) {
      try {
        this.connection = await amqp.connect(url);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queue, { durable: true });

        this.logger.log(`✅ Connected to RabbitMQ (queue: ${this.queue})`);
        return;
      } catch (err) {
        this.logger.error(`RabbitMQ connection failed (attempt ${attempt}):`, err);
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
    throw new Error('Could not connect to RabbitMQ');
  }

  async publish(message: any) {
    if (!this.channel) {
      this.logger.warn('Channel not found, reconnecting...');
      await this.connect();
    }

    const content = Buffer.from(JSON.stringify(message));
    this.channel!.sendToQueue(this.queue, content, { persistent: true });
    this.logger.log(`📤 Published message to queue: ${this.queue}`);
  }

  private async consume() {
    if (!this.channel) return;

    this.channel.consume(this.queue, async (msg) => {
      if (msg) {
        try {
          const data = JSON.parse(msg.content.toString());
          this.logger.log(`📥 Received message: ${JSON.stringify(data)}`);

          await this.essayProcessor.processEssay(
            data.essayId,
            data.text,
            data.taskType,
          );

          this.channel!.ack(msg);
        } catch (err) {
          this.logger.error('❌ Error processing message:', err);
          this.channel!.nack(msg, false, false); // bỏ message lỗi
        }
      }
    });
  }

  async onModuleDestroy() {
    try {
      if (this.channel) await this.channel.close();
      if (this.connection) await this.connection.close();
      this.logger.log('RabbitMQ connection closed');
    } catch (err) {
      this.logger.error('Error closing RabbitMQ:', err);
    }
  }
}
