import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { multerConfig } from 'src/utils';
import { DataGuard } from 'src/common/guards';
import { UserData } from 'src/common/decorators';

import { AddBookDto, addBookSchema, EditBookDto, editBookSchema } from '../dto';
import { BooksService } from '../service';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  async addBook(
    @UserData('userId') userId: string,
    @Body()
    addBokDto: AddBookDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsedSchema = addBookSchema.safeParse({ ...addBokDto, image });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);
    return await this.booksService.addBook(parsedSchema.data, userId);
  }

  @UseGuards(DataGuard)
  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':bookId')
  async editBook(
    @Param('bookId') bookId: string,
    @UserData('userId') userId: string,
    @Body() editBookDto: EditBookDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsedSchema = editBookSchema.safeParse({ ...editBookDto, image });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);
    return await this.booksService.editBook(bookId, userId, parsedSchema.data);
  }

  @UseGuards(DataGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':bookId')
  async deleteBook(@Param('bookId') bookId: string) {
    return await this.booksService.deleteBook(bookId);
  }

  @Get('book/:bookId')
  async getBook(@Param('bookId') bookId: string) {
    return await this.booksService.getBook(bookId);
  }

  @UseGuards(DataGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':bookId')
  async toggleFavorite(@Param('bookId') bookId: string) {
    return await this.booksService.toggleFavorite(bookId);
  }

  @Get('favorites')
  async getFavorites(@UserData('userId') userId: string) {
    return await this.booksService.getFavorites(userId);
  }
}
