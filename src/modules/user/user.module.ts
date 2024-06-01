import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { User, UserService } from '.';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
