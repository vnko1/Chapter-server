import { Module } from '@nestjs/common';

import { NotificationModule } from '../notification/notification.module';

import { NotificationsService } from './services';
import { NotificationsController } from './controller';

@Module({
  imports: [NotificationModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
