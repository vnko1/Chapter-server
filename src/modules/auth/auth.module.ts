import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard } from 'src/common/guards';
import { UserMiddleware } from 'src/common/middlewares';

import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';

import { AuthService } from './service';
import { AuthController } from './controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET,
      }),
    }),
    UserModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(AuthController);
  }
}
