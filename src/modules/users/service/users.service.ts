import { Injectable } from '@nestjs/common';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { UserService } from 'src/modules/user/service';

@Injectable()
export class UsersService extends AppService {
  constructor(private userService: UserService) {
    super();
  }

  async deleteUser(id: string) {
    return this.userService.deleteUser({ where: { id } });
  }

  async getUserById(id: string, scope?: UserScope) {
    return this.userService.findUserByPK(id, undefined, scope);
  }

  async changeUserPassword() {}
}
