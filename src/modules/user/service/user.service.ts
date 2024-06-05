import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CountOptions,
  DestroyOptions,
  FindOptions,
  FindOrCreateOptions,
  Optional,
  RestoreOptions,
  UpdateOptions,
} from 'sequelize';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { User } from '../model';

@Injectable()
export class UserService extends AppService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super();
  }

  findOrCreateUserInstance(options: FindOrCreateOptions) {
    return this.userModel.findOrCreate(options);
  }

  createUserInstance<T extends Optional<any, string>>(userData: T) {
    return this.userModel.create(userData);
  }

  findUser(opt: FindOptions, scope: UserScope = 'defaultScope') {
    return this.userModel.scope(scope).findOne(opt);
  }

  findUserByPK(
    pk: string,
    opt?: FindOptions,
    scope: UserScope = 'defaultScope',
  ) {
    return this.userModel.scope(scope).findByPk(pk, opt);
  }

  updateUser<T extends object>(userData: T, opt: UpdateOptions) {
    return this.userModel.update(userData, opt);
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

  countUsers(opt?: Omit<CountOptions<any>, 'group'>) {
    return this.userModel.count(opt);
  }
}
