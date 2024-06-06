import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { PostService } from './service';
import { Post } from './model';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
