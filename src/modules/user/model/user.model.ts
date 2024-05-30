import { AllowNull, Column, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @AllowNull(false)
  @Column({ unique: true })
  email: string;

  @AllowNull
  @Column
  password: string | null;

  @AllowNull
  @Column
  firstName: string | null;

  @AllowNull
  @Column
  lastName: string | null;

  @AllowNull
  @Column({ unique: true })
  nickName: string | null;

  @AllowNull
  @Column
  userStatus: string | null;

  @AllowNull
  @Column
  location: string | null;

  @AllowNull
  @Column
  avatarUrl: string | null;
}
