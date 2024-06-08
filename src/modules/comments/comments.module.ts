import { Module } from '@nestjs/common';

import { CommentModule } from '../comment/comment.module';
import { LikeModule } from '../like/like.module';
import { PostModule } from '../post/post.module';

import { CommentsController } from './controller';
import { CommentsService } from './service';

@Module({
  imports: [CommentModule, LikeModule, PostModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
