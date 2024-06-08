import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Like, LikeService } from '.';

@Module({
  imports: [SequelizeModule.forFeature([Like])],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
