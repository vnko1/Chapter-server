import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions, Optional } from 'sequelize';

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

  findUserByPK(pk: number, opt?: FindOptions, scope: UserScope = '') {
    return this.userModel.scope(scope).findByPk(pk, opt);
  }
}
