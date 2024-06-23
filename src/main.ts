import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppHttpExceptionFilter } from './common/exceptions';
import {
  ClearDataInterceptor,
  TransformInterceptor,
} from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://chapter-client.vercel.app'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Frame-Options',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalFilters(new AppHttpExceptionFilter());
  app.useGlobalInterceptors(new ClearDataInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
