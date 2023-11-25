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
import {
  EnterChatRoomType,
  ExitChatRoomType,
  SendDataType,
} from './types/chat-type';
import { ChatRoomService } from 'src/chatRoom/chat-room.service';
import { MessageType } from 'src/schemas/chat.schema';
import { Types } from 'mongoose';

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

  handleConnection(@ConnectedSocket() client: Socket) {
    // Handle new WebSocket connection
    console.log(`${new Date()},Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() @ConnectedSocket() client: Socket) {
    // Handle WebSocket disconnection
    console.log(`Client disconnected: ${client.id}`);
  }

  afterInit(server: Server) {
    console.log('WebSocket gateway initialized');
  }

  @SubscribeMessage('enterChatRoom')
  enterChatRoom(
    @ConnectedSocket() @ConnectedSocket() client: Socket,
    @MessageBody() payload: EnterChatRoomType,
  ): void {
    const { roomId } = payload;
    client.join(roomId);
    console.log(`${new Date()} ${roomId}에 누군가 입장하였습니다.`);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendDataType,
  ): void {
    const { roomId, message, userId, nickname } = payload;

    this.chatService.createChat({
      content: message,
      type: MessageType.TEXT,
      user_id: userId,
      room_id: roomId,
    });
    this.server.to(`${roomId}`).emit('message', {
      sender: client.id,
      message,
      nickname,
    });
  }

  @SubscribeMessage('sendImage')
  handleImage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendDataType,
  ): void {
    const { roomId, message, userId, nickname } = payload;

    this.chatService.createChat({
      content: message,
      type: MessageType.IMAGE,
      user_id: userId,
      room_id: roomId,
    });
    this.server.to(`${roomId}`).emit('message', {
      sender: client.id,
      message,
      nickname,
    });
  }

  @SubscribeMessage('exitChatRoom')
  async exitChatRoom(
    @ConnectedSocket() client: Socket,
    payload: ExitChatRoomType,
  ): Promise<void> {
    try {
      const { nickname, roomId, userId, userType } = payload;

      const message = `${nickname}님이 방에서 나갔습니다.`;

      await this.roomService.exitChatRoom(
        userId,
        new Types.ObjectId(roomId),
        userType,
      );

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
