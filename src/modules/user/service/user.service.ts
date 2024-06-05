import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  DestroyOptions,
  FindOptions,
  FindOrCreateOptions,
  Optional,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { User, UserSubscribers } from '../model';

@Injectable()
export class UserService extends AppService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(UserSubscribers)
    private userSubscribersModel: typeof UserSubscribers,
  ) {
    super();
  }

  findOrCreateUserInstance(options: FindOrCreateOptions) {
    return this.userModel.findOrCreate(options);
  }

  createUserInstance<T extends Optional<any, string>>(userData: T) {
    return this.userModel.create(userData);
  }

  findUser(findOpt: FindOptions, scope: UserScope = '') {
    return this.userModel.scope(scope).findOne(findOpt);
  }

  findUserByPK(pk: string, opt?: FindOptions, scope: UserScope = '') {
    return this.userModel.scope(scope).findByPk(pk, opt);
  }

  updateUser<T extends object>(userData: T, options: UpdateOptions) {
    return this.userModel.update(userData, options);
  }

  deleteUser(opt: DestroyOptions) {
    return this.userModel.destroy(opt);
  }

  restoreUser(opt: RestoreOptions) {
    return this.userModel.restore(opt);
  }

  getAllUsers(opt: FindOptions) {
    return this.userModel.findAll(opt);
  }
}
