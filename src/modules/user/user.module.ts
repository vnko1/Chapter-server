import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './model/user.model';
import { UserService } from './service/user.service';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UserService],
})
export class UserModule {}
