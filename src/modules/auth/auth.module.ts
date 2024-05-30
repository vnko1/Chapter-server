import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [UserModule],
})
export class AuthModule {}
