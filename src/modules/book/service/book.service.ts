import { InjectModel } from '@nestjs/sequelize';

import { ModelService } from 'src/common/services';

import { Book } from '../model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BookService extends ModelService<Book> {
  constructor(@InjectModel(Book) private readonly bookModel: typeof Book) {
    super(bookModel);
  }
}
