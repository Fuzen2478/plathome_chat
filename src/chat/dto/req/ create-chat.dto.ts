import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { MessageType } from 'src/schemas/chat.schema';
import { Types } from 'mongoose';
export class CreateChatDto {
  @ApiProperty({
    description: '채팅 내용',
    example: '김준하 차단',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '메세지 타입',
    example: MessageType.TEXT,
    enum: MessageType,
  })
  type: MessageType;

  @ApiProperty({
    description: 'user의 고유 id',
    example: 4,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'room의 고유 id',
    example: '655619f9f92ef0ab82b48a8b',
  })
  @IsNumber()
  room_id: string | Types.ObjectId;

  @ApiProperty({
    description: 'user의 닉네임',
    example: 4,
  })
  @IsString()
  nickname: string;
}
