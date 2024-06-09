import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { BookService } from './service';
import { Book } from './model';

@Module({
  imports: [SequelizeModule.forFeature([Book])],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
