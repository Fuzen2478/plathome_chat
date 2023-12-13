import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/user/strategies/jwt.strategy';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ChatRoomService } from './chat-room.service';
import { CreateChatRoomDto } from './dtos/create-chat-room.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ChatRoomDto } from './dtos/chat-room.dto';
import { ChatRoomResponseDto } from './dtos/res/chat-room-response.dto';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { Types } from 'mongoose';
import { ChatDto } from 'src/chat/dto/chat.dto';

@Controller()
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @ApiOperation({ summary: '1대1 대화요청하여 채팅방 생성' })
  @ApiHeader({
    name: 'x-access-token',
    description: 'JWT token',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: ChatRoom,
  })
  @Post('chatroom')
  async createChatRoom(
    @CurrentUser() user: UserEntity,
    @Body() dto: CreateChatRoomDto,
  ): Promise<ChatRoomDto> {
    return await this.chatRoomService.createChatRoom(dto, user.id);
  }

  @ApiOperation({ summary: '나의 채팅방 목록 조회' })
  @ApiResponse({
    type: [ChatRoomResponseDto],
  })
  @ApiHeader({
    name: 'x-access-token',
    description: 'JWT token',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me/chatrooms')
  async getMyChatRooms(@CurrentUser() user: UserEntity) {
    return await this.chatRoomService.getMyChatRooms(user.id);
  }

  @ApiOperation({ summary: '채팅방 페이지 상세 조회' })
  @ApiResponse({
    type: [ChatDto],
  })
  @ApiHeader({
    name: 'x-access-token',
    description: 'JWT token',
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('me/chatroom/:roomId')
  async getMyChatRoomDetails(@Param('roomId') roomId: string) {
    return await this.chatRoomService.getMyChatRoomDetails(
      new Types.ObjectId(roomId),
    );
  }
}
