import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from './user.model';

@Table
export class UserSubscribers extends Model {
  @ForeignKey(() => User)
  @Column
  userId: string;

  @ForeignKey(() => User)
  @Column
  subscriberId: string;
}
