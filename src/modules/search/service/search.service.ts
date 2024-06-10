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
    const user = this.userService.getAllUsers({
      where: Sequelize.literal(
        `MATCH (firsName, nickName, lastName, status, location) AGAINST('${query}' IN NATURAL LANGUAGE MODE)`,
      ),
    });

    return user;
  }
}
