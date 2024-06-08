import { Module } from '@nestjs/common';

import { CloudsModule } from '../clouds/clouds.module';
import { PostModule } from '../post/post.module';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/comment.module';

import { PostsService } from './service';
import { PostsController } from './controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CloudsModule, PostModule, LikeModule, CommentModule, UserModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
