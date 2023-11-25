import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { EnterChatRoomType, Message } from './types/chat-type';
import { ChatRoomService } from 'src/chatRoom/chat-room.service';
import { Types } from 'mongoose';
import { MessageType } from 'src/schemas/chat.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: ChatRoomService,
  ) {}

  handleConnection(client: Socket) {
    // Handle new WebSocket connection
    console.log(`${Date.now()},Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Handle WebSocket disconnection
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('enterChatRoom')
  enterChatRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: EnterChatRoomType,
  ): void {
    const { nickname, roomId } = payload;
    console.log(payload);
    const message = `${nickname}님이 방에 입장하였습니다.`;
    client.join(roomId);
    this.server.to(`${roomId}`).emit('adminMessage', {
      sender: client.id,
      message,
    });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(client: Socket, @MessageBody() message: string): void {}

  @SubscribeMessage('exitChatRoom')
  async exitChatRoom(
    client: Socket,
    payload: EnterChatRoomType,
  ): Promise<void> {
    try {
      const { nickname, roomId, userId } = payload;

      const message = `${nickname}님이 방에서 나갔습니다.`;

      // await this.roomService.exitChatRoom(userId, new Types.ObjectId(roomId));
      client.leave(`${roomId}`);
      this.server.to(`${roomId}`).emit('message', {
        sender: client.id,
        message,
      });
    } catch (error) {
      this.server.emit('error', error);
    }
  }
}
