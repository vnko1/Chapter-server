import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
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

import { AppService } from 'src/common/services';

import { Comment } from '../model';

@Injectable()
export class CommentService extends AppService {
  constructor(@InjectModel(Comment) private commentModel: typeof Comment) {
    super();
  }

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
