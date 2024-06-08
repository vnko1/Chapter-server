import { Module } from '@nestjs/common';

import { CommentModule, LikeModule, PostModule } from '..';

import { CommentsController, CommentsService } from '.';

@Module({
  imports: [CommentModule, LikeModule, PostModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
