import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService, User, UserSubscribers } from '.';

@Module({
  imports: [SequelizeModule.forFeature([User, UserSubscribers])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
