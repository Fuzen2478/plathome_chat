import { ChatDto } from 'src/chat/dto/chat.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ChatRoomDto } from '../chat-room.dto';

export class ChatRoomResponseDto extends ChatRoomDto {
  @ApiProperty({
    description: '마지막 채팅 정보',
  })
  @Expose()
  last_chat: ChatDto | null;
}
