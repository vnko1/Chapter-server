import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Like } from './model';
import { LikeService } from './service';

@Module({
  imports: [SequelizeModule.forFeature([Like])],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
