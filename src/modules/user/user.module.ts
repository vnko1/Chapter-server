import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService } from './service';
import { User, UserSubscribers } from './model';

@Module({
  imports: [SequelizeModule.forFeature([User, UserSubscribers])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
