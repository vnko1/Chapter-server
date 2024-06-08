import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { CommentService } from './service';
import { Comment } from './model';

@Module({
  imports: [SequelizeModule.forFeature([Comment])],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
