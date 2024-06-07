import {
  Table,
  Model,
  Column,
  AllowNull,
  ForeignKey,
  DataType,
  BelongsTo,
  BeforeSave,
} from 'sequelize-typescript';
import { Comment } from 'src/modules/comment/model';
import { Post } from 'src/modules/post/model';
import { User } from 'src/modules/user/model';

@Table
export class Like extends Model {
  @ForeignKey(() => Post)
  @AllowNull(false)
  @Column
  postId: number;

  @ForeignKey(() => Comment)
  @AllowNull(true)
  @Column({ type: DataType.UUID })
  commentId: string | null;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User, { as: 'liker' })
  liker: User;

  @BelongsTo(() => Post, { as: 'likedPost' })
  likedPost: Post;

  @BelongsTo(() => Comment, { as: 'likedComment' })
  likedComment: Comment;

  @BeforeSave
  static async validateLike(instance: Like) {
    if (!instance.postId && !instance.commentId) {
      throw new Error('Either postId or commentId must be provided.');
    }
  }
}
