import {
  AfterCreate,
  AfterUpdate,
  AfterValidate,
  AllowNull,
  BeforeValidate,
  BelongsToMany,
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

import { TIMEOUT_VALUES } from 'src/utils';

import { Like } from 'src/modules/like';
import { Comment } from 'src/modules/comment';
import { Post } from 'src/modules/post/model';

import { UserSubscribers } from './userSubscribers.model';
import { Book } from 'src/modules/book';

@Scopes(() => ({
  privateScope: {
    attributes: {
      exclude: ['password', 'otp', 'accountStatus'],
    },
  },
  privateScopeWithAssociation: {
    attributes: {
      exclude: ['password', 'otp', 'accountStatus'],
    },
    include: [
      {
        model: User,
        as: 'subscribers',
        attributes: {
          exclude: [
            'password',
            'otp',
            'accountStatus',
            'deletedAt',
            'createdAt',
            'updatedAt',
            'status',
            'location',
            'cookieAccepted',
            'deletedAt',
            'createdAt',
            'updatedAt',
          ],
        },
      },
      {
        model: User,
        as: 'subscribedTo',
        attributes: {
          exclude: [
            'password',
            'otp',
            'accountStatus',
            'deletedAt',
            'createdAt',
            'updatedAt',
            'status',
            'location',
            'cookieAccepted',
            'deletedAt',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    ],
  },
  publicScope: {
    attributes: {
      exclude: [
        'cookieAccepted',
        'password',
        'otp',
        'accountStatus',
        'deletedAt',
        'createdAt',
        'updatedAt',
      ],
    },
  },
  publicScopeWithAssociation: {
    attributes: {
      exclude: [
        'cookieAccepted',
        'password',
        'otp',
        'accountStatus',
        'deletedAt',
        'createdAt',
        'updatedAt',
      ],
    },
    include: [
      {
        model: User,
        as: 'subscribers',
        attributes: {
          exclude: [
            'password',
            'otp',
            'accountStatus',
            'deletedAt',
            'createdAt',
            'updatedAt',
            'status',
            'location',
            'cookieAccepted',
            'deletedAt',
            'createdAt',
            'updatedAt',
          ],
        },
      },
      {
        model: User,
        as: 'subscribedTo',
        attributes: {
          exclude: [
            'password',
            'otp',
            'accountStatus',
            'deletedAt',
            'createdAt',
            'updatedAt',
            'status',
            'location',
            'cookieAccepted',
            'deletedAt',
            'createdAt',
            'updatedAt',
          ],
        },
      },
    ],
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
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt();
      const hashedPass = await bcrypt.hash(instance.password, salt);
      instance.password = hashedPass;
    }
  }

  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  userId: string;

  @AllowNull(false)
  @Column({ unique: true, type: DataType.STRING })
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
  status: string | null;

  @AllowNull
  @Column
  location: string | null;

  @AllowNull
  @Column
  avatarUrl: string | null;

  @AllowNull
  @Column
  otp: string | null;

  @Default('unconfirmed')
  @Column(DataType.ENUM('unconfirmed', 'confirmed', 'completed', 'restoring'))
  accountStatus: 'unconfirmed' | 'confirmed' | 'completed' | 'restoring';

  @Default(false)
  @Column
  cookieAccepted: boolean;

  @BelongsToMany(() => User, () => UserSubscribers, 'userId', 'subscriberId')
  subscribers: User[];

  @BelongsToMany(() => User, () => UserSubscribers, 'subscriberId', 'userId')
  subscribedTo: User[];

  @HasMany(() => Post, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  posts: Post[];

  @HasMany(() => Like, {
    foreignKey: 'userId',
    as: 'likesGiven',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likesGiven: Like[];

  @HasMany(() => Like, {
    foreignKey: 'postId',
    as: 'likesReceived',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likesReceived: Like[];

  @HasMany(() => Comment, {
    foreignKey: 'userId',
    as: 'userComments',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: Comment[];

  @HasMany(() => Book, {
    foreignKey: 'userId',
    as: 'userBooks',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  books: Book[];
}
