import {
  AllowNull,
  BeforeCreate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { TIMEOUT_VALUES } from 'src/utils';

@Scopes(() => ({
  withoutSensitiveData: {
    attributes: { exclude: ['password', 'otp', 'accountStatus'] },
  },
}))
@Table
export class User extends Model {
  @BeforeCreate
  static clearOtp(instance: User) {
    setTimeout(() => {
      instance.otp = null;
      instance.save();
    }, TIMEOUT_VALUES.otp);
  }

  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id: string;

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
