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
    index: true,
  })
  seller_id: number;

  @Prop({
    required: true,
    index: true,
  })
  buyer_id: number;

  @Prop({
    required: true,
  })
  seller_nickname: string;

  @Prop({
    required: true,
  })
  buyer_nickname: string;

  @Prop({
    required: true,
    index: true,
  })
  estate_id: number;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
