import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppHttpExceptionFilter } from './common/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AppHttpExceptionFilter());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
