import {
  Table,
  Model,
  Column,
  DataType,
  AllowNull,
  Default,
} from 'sequelize-typescript';

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
}
