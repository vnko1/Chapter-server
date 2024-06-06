import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Like } from './model';

@Module({
  imports: [SequelizeModule.forFeature([Like])],
  providers: [],
  exports: [],
})
export class LikeModule {}
