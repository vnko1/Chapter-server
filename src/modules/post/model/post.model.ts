import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
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
  @Column
  userId: string;
}
