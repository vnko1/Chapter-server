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

import { Like } from 'src/modules/like/model';
import { Post } from 'src/modules/post/model';
import { User } from 'src/modules/user/model';

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

  @HasMany(() => Like, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  likes: Like[];

  @ForeignKey(() => Post)
  @AllowNull(false)
  @Column
  postId: number;

  @BelongsTo(() => Post, {
    foreignKey: 'postId',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  commentedPost: Post;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User, {
    foreignKey: 'userId',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  userComment: User;
}
