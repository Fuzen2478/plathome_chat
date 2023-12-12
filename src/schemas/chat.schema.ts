import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

export enum MessageType {
  IMAGE = 'image',
  TEXT = 'text',
}

@Schema({})
export class Chat {
  _id: Types.ObjectId;

  @Prop({
    required: true,
    ref: 'ChatRoom',
    index: true,
  })
  room_id: Types.ObjectId;

  @Prop({
    required: true,
    index: true,
  })
  user_id: number;

  @Prop({
    required: true,
  })
  nickname: string;

  @Prop({
    required: true,
  })
  content: string;

  @Prop({
    required: true,
  })
  type: MessageType;

  @Prop({ default: Date.now, index: true })
  created_at: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
