import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';

import { AuthService } from './service';
import { AuthController } from './controller';
import { AuthMiddleware } from './middlewares';

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
