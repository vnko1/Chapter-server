import { UsersModule } from './modules/users/users.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModule, AuthModule, MailModule, TasksModule } from './modules';
import { User } from './modules/user/model';

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
        models: [User],
      }),
    }),
    MailModule,
    UserModule,
    AuthModule,
    TasksModule,
    UsersModule,
  ],
})
export class AppModule {}
