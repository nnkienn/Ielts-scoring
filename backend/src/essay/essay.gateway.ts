import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class EssayGateway {
  private readonly logger = new Logger(EssayGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  // 🔔 Emit khi essay được update (emit vào room)
  notifyEssayUpdated(essayId: number, payload: any) {
    this.logger.log(`🔔 Emitting essay update for ID=${essayId}`);
    // Chuẩn hoá status trước khi emit để FE hiển thị đúng
    const normalized = payload
      ? { ...payload, status: String(payload.status ?? '').toLowerCase() }
      : payload;

    this.server.to(`essay_${essayId}`).emit(`essay_update_${essayId}`, normalized);
  }

  // 👂 Client join room theo essayId
  @SubscribeMessage('joinEssay')
  async handleJoinEssay(
    @MessageBody() data: { essayId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { essayId } = data;
    this.logger.log(`👥 Client ${client.id} joined essay_${essayId}`);
    client.join(`essay_${essayId}`);

    // ✅ Gửi lại state hiện tại từ DB ngay khi join
    const essay = await this.prisma.essaySubmission.findUnique({
      where: { id: essayId },
      include: { grading: true, prompt: true },
    });
    if (essay) {
      const normalized = { ...essay, status: essay.status.toLowerCase() };
      client.emit(`essay_update_${essayId}`, normalized);
    }
  }
}
