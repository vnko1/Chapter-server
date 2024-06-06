import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { DestroyOptions, FindAndCountOptions, FindOptions } from 'sequelize';

import { AppService } from 'src/common/services';

import { Like } from '../model';

@Injectable()
export class LikeService extends AppService {
  constructor(@InjectModel(Like) private likeModel: typeof Like) {
    super();
  }

  async addLike(postId: string, userId: string) {
    return this.likeModel.create({ postId, userId });
  }

  async findLike(opt?: FindOptions) {
    return this.likeModel.findOne(opt);
  }

  async findLikes(opt?: FindOptions) {
    return this.likeModel.findAll(opt);
  }

  async findAndCountLikes(opt?: Omit<FindAndCountOptions<any>, 'group'>) {
    return this.likeModel.findAndCountAll(opt);
  }

  async deleteLike(opt?: DestroyOptions) {
    return this.likeModel.destroy(opt);
  }
}
