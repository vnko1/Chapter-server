import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { NotificationService } from './services';

import { Notification } from './model';

@Module({
  imports: [SequelizeModule.forFeature([Notification])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
