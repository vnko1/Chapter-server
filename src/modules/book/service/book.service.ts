import { InjectModel } from '@nestjs/sequelize';

import {
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  Optional,
  UpdateOptions,
} from 'sequelize';

import { AppService } from 'src/common/services';

import { Book } from '../model';

export class BookService extends AppService {
  constructor(@InjectModel(Book) private readonly bookModel: typeof Book) {
    super();
  }

  async addBook(values?: Optional<any, string>, opt?: CreateOptions) {
    return this.bookModel.create(values, opt);
  }

  async editBook<T extends object>(values: T, opt: UpdateOptions) {
    return this.bookModel.update(values, opt);
  }

  async deleteBook(opt: DestroyOptions) {
    return this.bookModel.destroy(opt);
  }

  async findBookByPK(pk: string, opt?: FindOptions) {
    return this.bookModel.findByPk(pk, opt);
  }

  async findBook(opt?: FindOptions) {
    return this.bookModel.findOne(opt);
  }

  async findBooks(opt?: FindOptions) {
    return this.bookModel.findAll(opt);
  }

  async findAndCountBooks(opt?: Omit<FindAndCountOptions<any>, 'group'>) {
    return this.bookModel.findAndCountAll(opt);
  }
}
