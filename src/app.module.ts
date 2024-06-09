import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  UserModule,
  AuthModule,
  MailModule,
  TasksModule,
  UsersModule,
  PostModule,
  CommentModule,
  PostsModule,
  AdminModule,
  LikeModule,
  CommentsModule,
  FeedModule,
  BookModule,
  BooksModule,
  SearchModule,
} from './modules';
import { Post } from './modules/post';
import { User, UserSubscribers } from './modules/user';
import { Like } from './modules/like';
import { Comment } from './modules/comment';
import { Book } from './modules/book';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
    ScheduleModule.forRoot(),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_ROOT_PASSWORD,
        database: process.env.DB_DATABASE,
        retryAttempts: +process.env.DB_CONNECTIONS_ATTEMPTS || 5,
        synchronize: true,
        autoLoadModels: true,
        models: [User, UserSubscribers, Comment, Like, Post, Book],
      }),
    }),
    UserModule,
    PostModule,
    LikeModule,
    CommentModule,
    MailModule,
    AuthModule,
    TasksModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    FeedModule,
    AdminModule,
    BookModule,
    BooksModule,
    SearchModule,
  ],
})
export class AppModule {}
