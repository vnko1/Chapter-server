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
} from 'sequelize-typescript';

import { Comment } from 'src/modules/comment';
import { Like } from 'src/modules/like';
import { User } from 'src/modules/user';

@Table
export class Post extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  postId: string;

  @AllowNull
  @Column({ type: DataType.JSON })
  imagesUrl: string[];

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING })
  title: string;

  @AllowNull(false)
  @Default('')
  @Column({ type: DataType.STRING })
  text: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId: string;

  @HasMany(() => Like, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'postId',
  })
  likes: Like[];

  @HasMany(() => Comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'postId',
  })
  comments: Comment[];
}
