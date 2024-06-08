import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import {
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  Optional,
} from 'sequelize';

import { AppService } from 'src/common/services';

import { Like } from '../model';

@Injectable()
export class LikeService extends AppService {
  constructor(@InjectModel(Like) private likeModel: typeof Like) {
    super();
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

  async addLike<T extends Optional<any, string>>(
    values: T,
    opt?: CreateOptions,
  ) {
    return this.likeModel.create(values, opt);
  }
}
