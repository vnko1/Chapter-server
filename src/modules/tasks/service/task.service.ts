import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { addDays } from 'date-fns';

import { AppService } from 'src/common/services';
import { UserService } from 'src/modules/user';

@Injectable()
export class TaskService extends AppService {
  constructor(private userService: UserService) {
    super();
  }

  @Cron(CronExpression.EVERY_10_HOURS)
  async hardDeleteUsersAcc() {
    const currentDate = new Date();

    const expStamp = addDays(currentDate, -30);
    try {
      const users = await this.userService.getAllUsers({
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
        },
        paranoid: false,
      });
      for (const user of users) {
        if (user.deletedAt < expStamp)
          await this.userService.deleteUser({
            where: { userId: user.userId },
            force: true,
          });
      }
    } catch (error) {
      console.log('🚀 ~ TaskService ~ hardDeleteUsersAcc ~ error:', error);
    }
  }
}
