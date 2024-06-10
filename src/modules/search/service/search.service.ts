import { Injectable } from '@nestjs/common';
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
    const user = await this.userService.getAllUsers({
      where: Sequelize.literal(
        `MATCH (firstName, nickName, lastName, status, location, email) AGAINST('${query}' IN BOOLEAN MODE)`,
      ),
    });

    return user;
  }
}
