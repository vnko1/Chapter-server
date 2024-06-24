import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

import { AppService } from 'src/common/services';
import { BookService } from 'src/modules/book';
import { PostService } from 'src/modules/post';
import { UserService } from 'src/modules/user';

@Injectable()
export class SearchService extends AppService {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private bookService: BookService,
  ) {
    super();
  }

  async searchData(query: string, offset: number, limit: number) {
    const [users, posts, books] = await Promise.all([
      this.userSearch(query, offset, limit),
      this.postsSearch(query, offset, limit),
      this.booksSearch(query, offset, limit),
    ]);

    return { users, posts, books };
  }

  async userSearch(query: string, offset: number, limit: number) {
    return await this.userService.findAndCountData(
      {
        where: {
          [Op.or]: [
            { email: { [Op.like]: `%${query}%` } },
            { firstName: { [Op.like]: `%${query}%` } },
            { lastName: { [Op.like]: `%${query}%` } },
            { nickName: { [Op.like]: `%${query}%` } },
            { location: { [Op.like]: `%${query}%` } },
            { status: { [Op.like]: `%${query}%` } },
          ],
        },
        offset,
        limit,
      },
      'publicScopeWithAssociation',
    );
  }

  async postsSearch(query: string, offset: number, limit: number) {
    return await this.postService.findAndCountPosts({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { text: { [Op.like]: `%${query}%` } },
        ],
      },
      offset,
      limit,
    });
  }

  async booksSearch(query: string, offset: number, limit: number) {
    return await this.bookService.findAndCountBooks({
      where: {
        [Op.or]: [
          { bookName: { [Op.like]: `%${query}%` } },
          { author: { [Op.like]: `%${query}%` } },
          { annotation: { [Op.like]: `%${query}%` } },
          { bookStatus: { [Op.like]: `%${query}%` } },
        ],
      },
      offset,
      limit,
    });
  }
}
