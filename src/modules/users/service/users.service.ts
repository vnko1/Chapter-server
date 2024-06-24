import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { UploadApiOptions } from 'cloudinary';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { SocketGateway } from 'src/modules/socket';
import { UserService, User } from 'src/modules/user';
import { CloudsService } from 'src/modules/clouds';

import { UpdatePasswordDto, UpdateUserDto } from '../dto';
import { NotificationService } from 'src/modules/notification';

@Injectable()
export class UsersService extends AppService {
  constructor(
    private userService: UserService,
    private cloudsService: CloudsService,
    private socketGateway: SocketGateway,
    private notificationService: NotificationService,
  ) {
    super();
  }

  private uploadOption: UploadApiOptions = {
    resource_type: 'image',
    folder: 'chapter/avatar',
    overwrite: true,
  };

  private async uploadAvatar(image: Express.Multer.File, userId: string) {
    const res = await this.cloudsService.upload(image.path, {
      ...this.uploadOption,
      public_id: userId,
    });

    return await this.cloudsService.edit(res.secure_url, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  async deleteUser(userId: string) {
    return this.userService.deleteUser({ where: { userId } });
  }

  async getUserById(
    userId: string,
    findOptions?: FindOptions,
    scope?: UserScope,
  ) {
    const user = await this.userService.findUserByPK(
      userId,
      findOptions,
      scope,
    );

    if (!user) throw new NotFoundException('User not exists');
    return user;
  }

  async changeUserPassword(
    user: User,
    { password, newPassword }: UpdatePasswordDto,
  ) {
    const isValidPass = await this.checkPassword(password, user.password);

    if (!isValidPass)
      throw new UnauthorizedException('Wrong email or password');

    return this.userService.updateUser(
      { password: newPassword },
      { where: { userId: user.userId } },
    );
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    const { image, ...userData } = updateUserDto;
    Object.keys(userData).forEach((field) => (user[field] = userData[field]));
    if (image) user.avatarUrl = await this.uploadAvatar(image, user.userId);
    await user.save();

    return this.userService.findUserByPK(
      user.userId,
      undefined,
      'privateScope',
    );
  }

  async subscribeToggler(userId: string, subscribedToId: string) {
    const user = await this.userService.findUserByPK(
      userId,
      undefined,
      'privateScopeWithAssociation',
    );
    const subscribedTo = await this.userService.findUserByPK(subscribedToId);
    if (!subscribedTo) throw new NotFoundException('User not exists');

    const isSubscribed = await user.$has('subscribedTo', subscribedTo);

    if (isSubscribed) {
      await user.$remove('subscribedTo', subscribedTo);
      await this.notificationService.addNotification({
        userId: subscribedTo.userId,
        type: 'unsubscribe',
      });
    } else {
      await user.$add('subscribedTo', subscribedTo);
      await this.notificationService.addNotification({
        userId: subscribedTo.userId,
        type: 'subscribe',
      });
    }

    this.socketGateway.notifySubscribersChange(subscribedTo.userId, userId);
    const userSubs = await this.userService.findUserByPK(user.userId, {
      include: [
        {
          model: User,
          as: 'subscribedTo',
          attributes: ['userId'],
          through: {
            attributes: [],
          },
        },
      ],
    });
    return userSubs.subscribedTo;
  }

  async getSubscribers(userId: string) {
    const user = await this.userService.findUserByPK(
      userId,
      undefined,
      'privateScopeWithAssociation',
    );
    return user.subscribers;
  }

  async getSubscription(userId: string) {
    const user = await this.userService.findUserByPK(
      userId,
      undefined,
      'privateScopeWithAssociation',
    );

    return user.subscribedTo;
  }
}
