import {
  AfterCreate,
  AfterUpdate,
  AfterValidate,
  AllowNull,
  BeforeValidate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

import { TIMEOUT_VALUES } from 'src/utils';

@Scopes(() => ({
  withoutSensitiveData: {
    attributes: { exclude: ['password', 'otp'] },
  },
  withoutSensitiveAndAccStatusData: {
    attributes: { exclude: ['password', 'otp', 'accountStatus'] },
  },
  withoutAdminData: {
    attributes: {
      exclude: [
        'password',
        'otp',
        'accountStatus',
        'deletedAt',
        'createdAt',
        'updatedAt',
      ],
    },
  },
}))
@Table({ paranoid: true })
export class User extends Model {
  @AfterUpdate
  @AfterCreate
  @AfterValidate
  static clearOtp(instance: User) {
    if (instance.otp) {
      setTimeout(() => {
        instance.otp = null;
        instance.save();
      }, TIMEOUT_VALUES.otp);
    }
  }

  @BeforeValidate
  static async hashPass(instance: User) {
    if (instance.password) {
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(instance.password, salt);
      instance.password = hashedPass;
    }
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
  accountStatus:
    | 'unconfirmed'
    | 'confirmed'
    | 'completed'
    | 'restoring'
    | 'forgotPassword';

  @Default(false)
  @Column
  cookieAccepted: boolean;
}
