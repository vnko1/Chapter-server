import {
  Table,
  Model,
  Column,
  AllowNull,
  ForeignKey,
  DataType,
  PrimaryKey,
  Default,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/modules/user';

@Table
export class Book extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  bookId: string;

  @Column
  bookName: string;

  @Column
  author: string;

  @Column
  annotation: string;

  @AllowNull
  @Column
  imageUrl: string | null;

  @Default('read')
  @Column(DataType.ENUM('read', 'reading', 'finished'))
  bookStatus: 'read' | 'reading' | 'finished';

  @Default(false)
  @Column(DataType.BOOLEAN)
  favorite: boolean;

  @ForeignKey(() => User)
  @AllowNull(null)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
