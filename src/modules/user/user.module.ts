import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService } from './service';
import { User, UserSubscribers } from './model';
import { Post } from '../post/model';

@Module({
  imports: [SequelizeModule.forFeature([User, UserSubscribers, Post])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
