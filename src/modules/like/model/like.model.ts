import {
  Table,
  Model,
  Column,
  AllowNull,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
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
}
