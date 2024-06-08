import {
  Table,
  Model,
  Column,
  AllowNull,
  ForeignKey,
  DataType,
  BelongsTo,
  BeforeSave,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Comment } from 'src/modules/comment/model';
import { Post } from 'src/modules/post/model';
import { User } from 'src/modules/user/model';

@Table
export class Like extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  likeId: string;

  @ForeignKey(() => Post)
  @AllowNull(null)
  @Column({ type: DataType.UUID })
  postId: string;

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
