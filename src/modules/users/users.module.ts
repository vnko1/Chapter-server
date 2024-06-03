import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { UsersService } from './service';
import { UsersController } from './controller';

@Module({
  imports: [UserModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
