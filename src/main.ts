import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppHttpExceptionFilter } from './common/exceptions';
import { ClearDataInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalFilters(new AppHttpExceptionFilter());
  app.useGlobalInterceptors(new ClearDataInterceptor());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
