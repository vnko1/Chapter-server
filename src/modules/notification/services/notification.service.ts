import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Optional,
  UpdateOptions,
} from 'sequelize';

import { AppService } from 'src/common/services';

import { Notification } from '../model';

@Injectable()
export class NotificationService extends AppService {
  constructor(
    @InjectModel(Notification) private notificationModel: typeof Notification,
  ) {
    super();
  }

  async addNotification<T extends Optional<any, string>>(
    values: T,
    opt?: CreateOptions,
  ) {
    return this.notificationModel.create(values, opt);
  }

  async editNotification<T extends object>(values: T, opt?: UpdateOptions) {
    return this.notificationModel.update(values, opt);
  }

  async deleteNotification(opt: DestroyOptions) {
    return this.notificationModel.destroy(opt);
  }

  async getAllNotifications(opt?: FindOptions) {
    return this.notificationModel.findAll(opt);
  }
}
