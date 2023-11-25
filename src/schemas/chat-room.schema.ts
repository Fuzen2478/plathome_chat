import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatRoomDocument = HydratedDocument<ChatRoom>;

@Schema({})
export class ChatRoom {
  _id: Types.ObjectId;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  seller_id: number;

  @Prop({
    required: true,
  })
  buyer_id: number;

  @Prop({
    required: true,
  })
  estate_id: number;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
