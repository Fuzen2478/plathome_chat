import { Types } from 'mongoose';

export class ChatRoomDto {
  _id: Types.ObjectId;
  name: string;
  buyer_id: number;
  seller_id: number;
  created_at: Date;
  estate_id: number;
}
