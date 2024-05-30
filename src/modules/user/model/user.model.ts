import { AllowNull, Column, Default, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @AllowNull(false)
  @Column({ unique: true })
  email: string;

  @AllowNull
  @Column
  password: string | null;

  @AllowNull
  @Default(null)
  @Column
  firstName: string | null;

  @AllowNull
  @Default(null)
  @Column
  lastName: string | null;

  @AllowNull
  @Default(null)
  @Column({ unique: true })
  nickName: string | null;

  @AllowNull
  @Default(null)
  @Column
  userStatus: string | null;

  @AllowNull
  @Default(null)
  @Column
  location: string | null;

  @AllowNull
  @Default(null)
  @Column
  avatarUrl: string | null;

  @AllowNull
  @Column
  otp: string | null;
}
