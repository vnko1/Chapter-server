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
} from './modules';
import { User, UserSubscribers } from './modules/user/model';
import { Post } from './modules/post/model';
import { Like } from './modules/like/model';
import { Comment } from './modules/comment/model';

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
        retryAttempts: 1,
        synchronize: true,
        autoLoadModels: true,
        models: [User, UserSubscribers, Like, Post, Comment],
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
  ],
})
export class AppModule {}
