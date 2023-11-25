import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class ChatRoomDto {
  @ApiProperty({
    description: '방 id (PK)',
  })
  @Expose()
  _id: Types.ObjectId;

  @ApiProperty({
    description: '방 이름',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: '구매자 id',
  })
  @Expose()
  buyer_id: number;

  @ApiProperty({
    description: '판매자 id',
  })
  @Expose()
  seller_id: number;

  @ApiProperty({
    description: '생성일자 ',
  })
  @Expose()
  created_at: Date;

  @ApiProperty({
    description: '매물 id PK ',
  })
  @Expose()
  estate_id: number;
}
