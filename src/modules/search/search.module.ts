import { Module } from '@nestjs/common';
import { SearchController } from './controller';
import { SearchService } from './service';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { BookModule } from '../book/book.module';

@Module({
  imports: [UserModule, PostModule, BookModule],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
