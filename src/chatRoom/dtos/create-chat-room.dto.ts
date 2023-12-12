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
  seller_id: number;

  @ApiProperty({
    example: 'test22',
    description: '게시글 올린 사람 즉 양도자의 닉네임',
    required: true,
  })
  @Expose()
  seller_nickname: string;

  @ApiProperty({
    example: 'test23',
    description: '양도받는 사람의 닉네임',
    required: true,
  })
  @Expose()
  buyer_nickname: string;

  @ApiProperty({
    example: 1,
    description: '게시글 올린 사람 즉 양도자의 userId',
    required: true,
  })
  @Expose()
  estate_id: number;
}
