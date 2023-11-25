import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { CreateChatRoomDto } from './dtos/create-chat-room.dto';

import { ChatService } from 'src/chat/chat.service';
import { ChatRoomResponseDto } from './dtos/res/chat-room-response.dto';
import { ChatRoomRepository } from './chat-room.repository';
import { ChatRoomDto } from './dtos/chat-room.dto';
import { UserType } from 'src/chat/types/chat-type';

@Injectable()
export class ChatRoomService {
  constructor(
    private readonly roomRepository: ChatRoomRepository,
    private readonly chatService: ChatService,
  ) {}

  async getMyChatRooms(userId: number): Promise<ChatRoomResponseDto[]> {
    const chatRooms = await this.roomRepository.findRoomByUserId(userId);
    const chatRoomDtos: ChatRoomResponseDto[] = [];

    for (const chatRoom of chatRooms) {
      const last_chat = await this.chatService.getLastChatById(chatRoom._id);

      chatRoomDtos.push({
        ...chatRoom,
        last_chat,
      });
    }

    return chatRoomDtos;
  }

  async createChatRoom(
    dto: CreateChatRoomDto,
    userId: number,
  ): Promise<ChatRoomDto> {
    const chatRoom = await this.roomRepository.createChatRoom(dto, userId);

    return chatRoom;
  }

  async exitChatRoom(
    userId: number,
    roomId: Types.ObjectId,
    userType: UserType,
  ) {
    const room: ChatRoom | null =
      await this.roomRepository.findRoomById(roomId);

    if (!room) {
      throw new NotFoundException('찾을 수 없는 채팅방입니다');
    }

    if (room.buyer_id !== userId && room.seller_id !== userId) {
      throw new BadRequestException('이미 나간 채팅방입니다.');
    }

    if (userType === UserType.BUYER && userId === room.buyer_id) {
      delete room.buyer_id;
    }

    if (userType === UserType.SELLER && userId === room.seller_id) {
      delete room.seller_id;
    }

    const updatedRoom = await this.roomRepository.updateChatRoom(room);

    if (!updatedRoom.buyer_id && !updatedRoom.seller_id) {
      await this.roomRepository.deleteRoom(updatedRoom._id);
    }
    return updatedRoom;
  }
}
