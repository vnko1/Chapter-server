import { Module } from '@nestjs/common';

import { CloudsModule } from '../clouds/clouds.module';

import { UserModule } from '..';

import { UsersService, UsersController } from '.';

@Module({
  imports: [CloudsModule, UserModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
