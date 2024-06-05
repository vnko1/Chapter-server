import { Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { UserService } from 'src/modules/user/service';
import { PostService } from 'src/modules/post/service';

@Injectable()
export class AdminService extends AppService {
  constructor(
    private userService: UserService,
    private postService: PostService,
  ) {
    super();
  }

  async getUserById(id: string, findOptions?: FindOptions, scope?: UserScope) {
    return this.userService.findUserByPK(id, findOptions, scope);
  }
}
