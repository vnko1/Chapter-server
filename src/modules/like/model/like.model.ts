import {
  Table,
  Model,
  Column,
  AllowNull,
  ForeignKey,
  DataType,
  BelongsTo,
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

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId: string;

  @ForeignKey(() => Comment)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  commentId: string;

  @BelongsTo(() => User, { as: 'liker' })
  liker: User;

  @BelongsTo(() => Post, { as: 'likedPost' })
  likedPost: Post;

  @BelongsTo(() => Comment)
  comment: Comment;
}
