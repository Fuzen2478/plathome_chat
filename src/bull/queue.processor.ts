import { HttpService } from '@nestjs/axios';
import { Process, Processor } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { firstValueFrom } from 'rxjs';
import { ChatService } from 'src/chat/chat.service';

@Processor('chat')
export class ChatProcessor {
  constructor(private readonly chatService: ChatService) {}

  @Process('save-chat')
  async handleMessage(job: Job) {
    await this.chatService.createChat(job.data);
  }
}
