import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';

import {
  UserModule,
  AuthModule,
  MailModule,
  TasksModule,
  PostModule,
  UsersModule,
} from './modules';
import { User, UserSubscribers } from './modules/user/model';
import { Post } from './modules/post/model';

@Module({
  imports: [
    UsersModule,
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
        synchronize: true,
        autoLoadModels: true,
        models: [User, UserSubscribers, Post],
      }),
    }),
    MailModule,
    UserModule,
    AuthModule,
    TasksModule,
    UsersModule,
    PostModule,
  ],
})
export class AppModule {}
