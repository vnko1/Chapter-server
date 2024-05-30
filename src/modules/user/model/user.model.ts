import {
  AllowNull,
  Column,
  DataType,
  Default,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';

@Scopes(() => ({
  withoutSensitiveData: {
    attributes: { exclude: ['password', 'otp', 'accountStatus'] },
  },
}))
@Table
export class User extends Model {
  @AllowNull(false)
  @Column({ unique: true, type: DataType.STRING })
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
  status: string | null;

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

  @Default('unconfirmed')
  @Column
  accountStatus: 'unconfirmed' | 'confirmed' | 'registered';
}
