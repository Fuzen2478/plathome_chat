import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as expressBasicAuth from 'express-basic-auth';
import { SocketIoAdapter } from './chat/adapters/socket-io.adapters';
import { UnhandledExceptionFilter } from './common/filiters/unhandled-exception.filter';
import { HttpExceptionFilter } from './common/filiters/http-exception.filter';
import { ValidationHttpError } from './common/errors/validation-http-error';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: true,
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app));

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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new ValidationHttpError(errors);
      },
    }),
  );

  app.useGlobalFilters(
    new UnhandledExceptionFilter(),
    new HttpExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('PlatHome Swagger')
    .setDescription('소프트웨어 공학 PlatHome 채팅 서버 Swagger입니다.')
    .setVersion('1.0.0')
    .addTag('swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  const port = app.get<ConfigService>(ConfigService).get('SERVER_PORT');

  await app.listen(port);
}
bootstrap();
