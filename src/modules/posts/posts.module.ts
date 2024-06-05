import { Module } from '@nestjs/common';
import { PostsService } from './service';

@Module({
  imports: [],
  controllers: [],
  providers: [PostsService],
})
export class PostsModule {}
