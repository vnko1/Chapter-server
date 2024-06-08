import { Injectable } from '@nestjs/common';
import { AppService } from 'src/common/services';
import { BookService } from 'src/modules/book/service';

@Injectable()
export class BooksService extends AppService {
  constructor(private bookService: BookService) {
    super();
  }
}
