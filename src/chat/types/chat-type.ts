import { MessageType } from 'src/schemas/chat.schema';

export type Message = {
  userId: number;
  nickname: string;
  message: string;
  type: MessageType.TEXT;
  roomId: string;
};

export type SendMessageType = {
  userId: number;
  roomId: string;
  nickname: string;
  message: string;
};

export type EnterChatRoomType = {
  roomId: string;
};
