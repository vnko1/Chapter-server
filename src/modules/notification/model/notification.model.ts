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
export class Notification extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  notificationId: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  userId: string;

  @AllowNull(false)
  @Column(DataType.ENUM('subscribe', 'unsubscribe'))
  type: 'subscribe' | 'unsubscribe';

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  viewed: boolean;

  @BelongsTo(() => User)
  user: User;
}
