import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { BaseService } from './service/base.service';
import { BaseMiddleware } from './middleware/base.middleware';
import { BaseController } from './controller/base.controller';

@Module({
  imports: [],
  controllers: [BaseController],
  providers: [BaseService],
})
export class BaseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BaseMiddleware).forRoutes(BaseController);
  }
}
