import { Module } from '@nestjs/common';

import { CloudsModule } from '../clouds/clouds.module';
import { BookModule } from '../book/book.module';

import { BooksController, BooksService } from '.';

@Module({
  imports: [BookModule, CloudsModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
