import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService } from './service';
import { User } from './model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
