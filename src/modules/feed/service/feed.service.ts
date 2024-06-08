import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';

import { COMMENTS_LIMIT } from 'src/utils';
import { AppService } from 'src/common/services';
import { Comment } from 'src/modules/comment';
import { Like } from 'src/modules/like';
import { PostService } from 'src/modules/post';

@Injectable()
export class FeedService extends AppService {
  constructor(private postService: PostService) {
    super();
  }

  async getPosts(offset: number, limit: number) {
    const { count, rows } = await this.postService.findAndCountPosts({
      offset,
      limit,
      order: [['createdAt', 'ASC']],
      attributes: {
        exclude: ['likeId'],
      },
      include: [
        { model: Like, as: 'likes', attributes: ['userId'] },
        {
          model: Comment,
          where: { parentId: { [Op.is]: null } },
          limit: COMMENTS_LIMIT,
          required: false,
          order: [['createdAt', 'ASC']],
          include: [
            {
              model: Like,
              as: 'commentLikes',
              attributes: ['userId'],
            },
            {
              model: Comment,
              as: 'replies',
              order: [['createdAt', 'ASC']],
              required: false,
              include: [
                {
                  model: Like,
                  as: 'replyLikes',
                  attributes: ['userId'],
                },
              ],
            },
          ],
        },
      ],
    });

    return { count, posts: rows };
  }
}
