import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  CountOptions,
  DestroyOptions,
  FindOptions,
  Optional,
  UpdateOptions,
} from 'sequelize';

import { AppService } from 'src/common/services';
import { Post } from '../model';

@Injectable()
export class PostService extends AppService {
  constructor(
    @InjectModel(Post)
    private postModel: typeof Post,
  ) {
    super();
  }

  createPost<T extends Optional<any, string>>(postData: T, userId: string) {
    return this.postModel.create({ ...postData, userId });
  }

  editPost<T extends object>(postData: T, opt: UpdateOptions) {
    return this.postModel.update(postData, opt);
  }

  deletePost(opt: DestroyOptions) {
    return this.postModel.destroy(opt);
  }

  findPostByPK(pk: string, opt?: FindOptions) {
    return this.postModel.findByPk(pk, opt);
  }

  findPost(opt: FindOptions) {
    return this.postModel.findOne(opt);
  }

  getPosts(opt: FindOptions) {
    return this.postModel.findAll(opt);
  }

  countPosts(opt?: Omit<CountOptions<any>, 'group'>) {
    return this.postModel.count(opt);
  }
}
