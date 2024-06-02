import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  FindOptions,
  FindOrCreateOptions,
  Optional,
  UpdateOptions,
} from 'sequelize';

import { AppService } from 'src/common/services';

import { User } from '../model';

type UserScope =
  | ''
  | 'withoutSensitiveData'
  | 'withoutSensitiveAndAccStatusData';

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

  findUser(findOpt: FindOptions, scope: UserScope = '') {
    return this.userModel.scope(scope).findOne(findOpt);
  }

  findUserByPK(pk: string, opt?: FindOptions, scope: UserScope = '') {
    return this.userModel.scope(scope).findByPk(pk, opt);
  }

  updateUser<T extends object>(userData: T, options: UpdateOptions) {
    return this.userModel.update(userData, options);
  }
}
