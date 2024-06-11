import { Module } from '@nestjs/common';

import { CloudsModule } from '../clouds/clouds.module';
import { SocketModule } from '../socket/socket.module';
import { UserModule } from '..';

import { UsersService, UsersController } from '.';

@Module({
  imports: [SocketModule, CloudsModule, UserModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
