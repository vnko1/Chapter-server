import { Injectable } from '@nestjs/common';

import { AppService } from 'src/common/services';
import { User } from 'src/modules/user';
import { NotificationService } from 'src/modules/notification';

@Injectable()
export class NotificationsService extends AppService {
  constructor(private notificationsService: NotificationService) {
    super();
  }

  getAllNots(userId: string) {
    return this.notificationsService.getAllNotifications({
      where: { userId },
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: User,
          attributes: {
            exclude: [
              'password',
              'otp',
              'accountStatus',
              'cookieAccepted',
              'provider',
              'deletedAt',
            ],
          },
        },
      ],
    });
  }

  setAsReadNots(notsId: string) {
    return this.notificationsService.editNotification(
      { viewed: true },
      { where: { notificationId: notsId } },
    );
  }

  deleteNot(notsId: string) {
    return this.notificationsService.deleteNotification({
      where: { notificationId: notsId },
    });
  }

  deleteAllNots(userId: string) {
    return this.notificationsService.deleteNotification({
      where: { userId },
    });
  }
}
