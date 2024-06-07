import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { AppService } from 'src/common/services';

import { Comment } from '../model';
import {
  BuildOptions,
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  Optional,
  UpdateOptions,
} from 'sequelize';
import { Op } from 'sequelize';

@Injectable()
export class CommentService extends AppService {
  constructor(@InjectModel(Comment) private commentModel: typeof Comment) {
    super();
  }

  queryOpt: FindOptions = {
    order: [['createdAt', 'ASC']],
    include: [
      {
        model: Comment,
        where: { parentId: { [Op.is]: null } },
        required: false,
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: Comment,
            as: 'replies',
            order: [['createdAt', 'ASC']],
            required: false,
          },
        ],
      },
    ],
  };

  async createInstance(values?: Optional<any, string>, opt?: BuildOptions) {
    return new Comment(values, opt);
  }

  async createComment<T extends Optional<any, string>>(
    values?: T,
    opt?: CreateOptions,
  ) {
    return this.commentModel.create(values, opt);
  }

  async editComment<T extends object>(value: T, opt: UpdateOptions) {
    return this.commentModel.update(value, opt);
  }

  async deleteComment(opt: DestroyOptions) {
    return this.commentModel.destroy(opt);
  }

  async findCommentByPK(pk: string, opt?: FindOptions) {
    return this.commentModel.findByPk(pk, opt);
  }

  async findComment(opt: FindOptions) {
    return this.commentModel.findOne(opt);
  }

  async getComments(opt: FindOptions) {
    return this.commentModel.findAll(opt);
  }

  async countComments(opt?: Omit<CountOptions<any>, 'group'>) {
    return this.commentModel.count(opt);
  }

  async findAndCountComments(opt?: Omit<FindAndCountOptions<any>, 'group'>) {
    return this.commentModel.findAndCountAll(opt);
  }
}
