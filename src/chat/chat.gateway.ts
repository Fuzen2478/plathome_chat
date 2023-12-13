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
import { InjectQueue, Processor } from '@nestjs/bull';
import { Queue } from 'bull';
import { UseFilters } from '@nestjs/common';
import { WebsocketExceptionsFilter } from 'src/common/filiters/socket.exception';
import { WsException } from '@nestjs/websockets';

@Processor('chat')
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@UseFilters(WebsocketExceptionsFilter)
export class ChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly roomService: ChatRoomService,
    @InjectQueue('chat') private readonly chatQueue: Queue,
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
  async enterChatRoom(
    @ConnectedSocket() @ConnectedSocket() client: Socket,
    @MessageBody() payload: EnterChatRoomType,
  ): Promise<void> {
    const { roomId, userId } = payload;
    const room = await this.roomService.fetchRoomById(
      new Types.ObjectId(roomId),
    );

    if (!room) {
      throw new WsException('방을 찾을 수 없습니다.');
    }

    if (room.buyer_id !== userId && room.seller_id !== userId) {
      throw new WsException('방에 입장할 권한이 없습니다. ');
    }

    client.join(roomId);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendDataType,
  ): void {
    const { roomId, message, userId, nickname } = payload;
    console.log('send : ', payload);

    this.chatQueue.add('save-chat', {
      user_id: userId,
      nickname,
      room_id: roomId,
      content: message,
      created_at: new Date(),
      type: MessageType.TEXT,
    });

    this.server.to(`${roomId}`).emit('message', {
      sender: client.id,
      userId: userId,
      message,
      nickname,
      type: MessageType.TEXT,
    });
  }

  @SubscribeMessage('sendImage')
  handleImage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SendDataType,
  ): void {
    const { roomId, message, userId, nickname } = payload;
    this.chatQueue.add(
      'save-chat',
      {
        userId,
        nickname,
        roomId,
        content: message,
        createdAt: new Date(),
        type: MessageType.IMAGE,
      },
      {
        removeOnComplete: true,
      },
    );
    this.server.to(`${roomId}`).emit('message', {
      sender: client.id,
      userId: userId,
      message,
      nickname,
      type: MessageType.IMAGE,
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
