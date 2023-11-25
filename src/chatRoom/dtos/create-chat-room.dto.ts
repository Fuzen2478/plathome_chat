import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateChatRoomDto {
  @ApiProperty({
    example: '아주대 삼거리 300/35 매물 양도합니다.',
    description: '채팅방 이름 (게시글 제목)',
    required: true,
  })
  @Expose()
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: '게시글 올린 사람 즉 양도자의 userId',
    required: true,
  })
  @Expose()
  sellerId: number;

  @ApiProperty({
    example: 1,
    description: '게시글 올린 사람 즉 양도자의 userId',
    required: true,
  })
  @Expose()
  estateId: number;
}
