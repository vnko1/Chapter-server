import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { randomUUID } from 'crypto';

import { AppService } from 'src/common/services';
import { BookService } from 'src/modules/book';
import { CloudsService } from 'src/modules/clouds';

import { AddBookDto, EditBookDto } from '../dto';

@Injectable()
export class BooksService extends AppService {
  constructor(
    private bookService: BookService,
    private cloudsService: CloudsService,
  ) {
    super();
  }
  private uploadOption: UploadApiOptions = {
    resource_type: 'image',
    folder: 'chapter/books',
    overwrite: false,
  };

  private async uploadImage(image: Express.Multer.File, userId: string) {
    const res = await this.cloudsService.upload(image.path, {
      ...this.uploadOption,
      public_id: userId + '/' + randomUUID(),
    });

    return await this.cloudsService.edit(res.secure_url, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  async addBook(bookDto: AddBookDto, userId: string) {
    const { image, ...book } = bookDto;

    const imageUrl = await this.uploadImage(image, userId);

    return this.bookService.add({ ...book, imageUrl, userId });
  }

  async editBook(bookId: string, userId: string, editBookDto: EditBookDto) {
    const book = await this.bookService.findByPk(bookId);
    const { image, ...bookDto } = editBookDto;

    if (image) {
      await this.cloudsService.delete(book.imageUrl);
      book.imageUrl = await this.uploadImage(image, userId);
    }

    book.annotation = bookDto.annotation;
    book.author = bookDto.author;
    book.bookName = bookDto.bookName;
    book.bookStatus = bookDto.bookStatus;
    return await book.save();
  }

  async deleteBook(bookId: string) {
    const book = await this.bookService.findByPk(bookId);
    await this.cloudsService.delete(book.imageUrl);
    return await book.destroy();
  }

  async getBook(bookId: string) {
    const book = await this.bookService.findByPk(bookId);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async toggleFavorite(bookId: string) {
    const book = await this.bookService.findByPk(bookId);
    book.favorite = !book.favorite;
    return book.save();
  }

  async getFavorites(userId: string) {
    return this.bookService.findAll({ where: { userId, favorite: true } });
  }
}
