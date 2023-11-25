import { Types } from 'mongoose';
import { MessageType } from 'src/schemas/chat.schema';

export class ChatDto {
  _id: Types.ObjectId;
  user_id: number;
  content: string;
  type: MessageType;
  room_id: Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}
