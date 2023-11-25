import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatRoom } from 'src/schemas/chat-room.schema';
import { CreateChatRoomDto } from './dtos/create-chat-room.dto';

@Injectable()
export class ChatRoomRepository {
  @InjectModel(ChatRoom.name) private roomModel: Model<ChatRoom>;

  async createChatRoom(
    dto: CreateChatRoomDto,
    buyer_id: number,
  ): Promise<ChatRoom> {
    return await this.roomModel.create({ ...dto, buyer_id });
  }

  async findRoomByUserId(user_id: number): Promise<ChatRoom[]> {
    return await this.roomModel
      .find({ $or: [{ seller_id: user_id }, { buyer_id: user_id }] })
      .sort({ created_at: -1 });
  }

  async findRoomById(roomId: Types.ObjectId): Promise<ChatRoom | null> {
    return await this.roomModel.findById({ _id: roomId });
  }

  async updateChatRoom(room: ChatRoom) {
    return await this.roomModel.findOneAndUpdate({ _id: room._id }, room, {
      returnNewDocument: true,
    });
  }

  async deleteRoom(room_id: Types.ObjectId) {
    return await this.roomModel.findOneAndDelete({ _id: room_id });
  }
}
