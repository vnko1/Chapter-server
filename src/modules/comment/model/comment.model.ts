import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  HasMany,
  PrimaryKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Like } from 'src/modules/like';
import { User } from 'src/modules/user';
import { Post } from 'src/modules/post/model';

@Table
export class Comment extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  commentId: string;

  @AllowNull(false)
  @Column
  text: string;

  @ForeignKey(() => Post)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  postId: string;

  @BelongsTo(() => Post, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  commentedPost: Post;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userComment: User;

  @ForeignKey(() => Comment)
  @AllowNull(true)
  @Column({ type: DataType.UUID })
  parentId: string | null;

  @BelongsTo(() => Comment, { onDelete: 'CASCADE' })
  parentComment: Comment;

  @HasMany(() => Comment, { foreignKey: 'parentId', onDelete: 'CASCADE' })
  replies: Comment[];

  @HasMany(() => Like, {
    foreignKey: 'commentId',
    as: 'commentLikes',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  commentLikes: Like[];

  @HasMany(() => Like, {
    foreignKey: 'commentId',
    as: 'replyLikes',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  replyLikes: Like[];
}
