import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  app.use(
    ['/api/docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [`${process.env.SWAGGER_USERNAME}`]: `${process.env.SWAGGER_PASSWORD}`,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TravelMate Swagger')
    .setDescription('소프트웨어 공학 PlatHome 채팅 서버 Swagger입니다.')
    .setVersion('1.0.0')
    .addTag('swagger')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const port = app.get<ConfigService>(ConfigService).get('SERVER_PORT');

  await app.listen(port);
}
bootstrap();
