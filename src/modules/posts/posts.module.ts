import { Module } from '@nestjs/common';

import { CloudsModule } from '../clouds/clouds.module';
import { PostModule } from '../post/post.module';
import { LikeModule } from '../like/like.module';

import { PostsService } from './service';
import { PostsController } from './controller';

@Module({
  imports: [CloudsModule, PostModule, LikeModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
