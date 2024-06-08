import { InjectModel } from '@nestjs/sequelize';
import { AppService } from 'src/common/services';

import { Book } from '../model';

export class BookService extends AppService {
  constructor(@InjectModel(Book) private readonly bookMode: typeof Book) {
    super();
  }
}
