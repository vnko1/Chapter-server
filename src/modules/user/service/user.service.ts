import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
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

  createUserInstance<T extends Optional<any, string>>(
    values: T,
    opt?: CreateOptions,
  ) {
    return this.userModel.create(values, opt);
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

  updateUser<T extends object>(values: T, opt: UpdateOptions) {
    return this.userModel.update(values, opt);
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

  countData(opt?: Omit<CountOptions<any>, 'group'>) {
    return this.userModel.count(opt);
  }

  findAndCountData(
    opt?: Omit<FindAndCountOptions<any>, 'group'>,
    scope: UserScope = 'defaultScope',
  ) {
    return this.userModel.scope(scope).findAndCountAll(opt);
  }
}
