import { Module } from '@nestjs/common';

import { PostModule } from '../post/post.module';

import { FeedController, FeedService } from '.';

@Module({
  imports: [PostModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
