import { Module } from '@nestjs/common';

import { BookModule } from '../book/book.module';
import { BooksController, BooksService } from '.';

@Module({
  imports: [BookModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
