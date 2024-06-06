import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';

import { AppService } from 'src/common/services';

import { Like } from '../model';
import { FindAndCountOptions } from 'sequelize';

@Injectable()
export class LikeService extends AppService {
  constructor(
    @InjectModel(Like) private likeModel: typeof Like,
    // private postService: PostService,
    // private userService: UserService,
  ) {
    super();
  }

  async addLike(postId: string, userId: string) {
    return this.likeModel.create({ userId, postId });
  }

  async getLikes(opt?: Omit<FindAndCountOptions<any>, 'group'>) {
    return this.likeModel.findAndCountAll(opt);
  }
}
