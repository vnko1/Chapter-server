import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Optional, UpdateOptions } from 'sequelize';

import { AppService } from 'src/common';
import { User } from '../model/user.model';

type UserScope = '' | 'withoutSensitiveData';

@Injectable()
export class UserService extends AppService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super();
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
