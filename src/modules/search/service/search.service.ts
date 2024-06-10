import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import { AppService } from 'src/common/services';
import { BookService } from 'src/modules/book';
import { PostService } from 'src/modules/post';

import { UserService } from 'src/modules/user';

@Injectable()
export class SearchService extends AppService {
  constructor(
    private sequelize: Sequelize,
    private userService: UserService,
    private postService: PostService,
    private bookService: BookService,
  ) {
    super();
  }

  async searchData(query: string) {
    const users = await this.userService.getAllUsers(
      {
        where: {
          [Op.and]: [
            { email: query },
            { firstName: query },
            { lastName: query },
            { nickName: query },
            { location: query },
            { status: query },
          ],
        },
      },
      'publicScope',
    );

    return users;
  }
}
