import { Module } from '@nestjs/common';

import { CloudsModule } from '../clouds/clouds.module';
import { SocketModule } from '../socket/socket.module';
import { NotificationModule } from '../notification/notification.module';
import { UserModule } from '../user/user.module';

import { UsersService, UsersController } from '.';

@Module({
  imports: [SocketModule, CloudsModule, UserModule, NotificationModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
