import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Comment } from 'src/modules/comment/model';
import { Like } from 'src/modules/like/model';
import { User } from 'src/modules/user/model';

@Table
export class Post extends Model {
  @AllowNull
  @Column({ type: DataType.STRING })
  imageUrl: string;

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
