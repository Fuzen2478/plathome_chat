import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { createAdapter } from 'socket.io-redis';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private readonly redisAdapter: any;

  constructor(private readonly app: INestApplication) {
    super(app);

    const configService = app.get(ConfigService);
    const redisHost = configService.get<string>('REDIS_HOST');
    const redisPort = configService.get<string>('REDIS_PORT');
    const pubClient = new RedisClient({
      host: redisHost,
      port: redisPort,
    });

    const subClient = pubClient.duplicate();
    this.redisAdapter = createAdapter({ pubClient, subClient });
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.redisAdapter);
    return server;
  }
}
