import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';

import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule, MailModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AuthController);
  }
}
