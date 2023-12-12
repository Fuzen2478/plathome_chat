import { MessageType } from 'src/schemas/chat.schema';

export enum UserType {
  SELLER = 'seller',
  BUYER = 'buyer',
}

export type Message = {
  userId: number;
  nickname: string;
  message: string;
  type: MessageType.TEXT;
  roomId: string;
};

export type SendDataType = {
  userId: number;
  roomId: string;
  nickname: string;
  message: string;
};

export type EnterChatRoomType = {
  roomId: string;
  userId: number;
};

export type ExitChatRoomType = {
  roomId: string;
  userId: number;
  nickname: string;
  userType: UserType;
};
