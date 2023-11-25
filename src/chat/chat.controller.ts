import { Controller, Get, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiOperation } from '@nestjs/swagger';
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
}
