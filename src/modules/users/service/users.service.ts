import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOptions } from 'sequelize';
import { UploadApiOptions } from 'cloudinary';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { UserService, User } from 'src/modules/user';
import { CloudsService } from 'src/modules/clouds';

import { UpdatePasswordDto, UpdateUserDto } from '../dto';
import { SocketGateway } from 'src/modules/socket/gateway';

@Injectable()
export class UsersService extends AppService {
  constructor(
    private userService: UserService,
    private cloudsService: CloudsService,
    private socketGateway: SocketGateway,
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

    await this.userService.updateUser(userData, {
      where: { userId: user.userId },
    });

    if (image) {
      user.avatarUrl = await this.uploadAvatar(image, user.userId);
      await user.save();
    }
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

    this.socketGateway.notifySubscribersChange(userId);

    if (isSubscribed) return await user.$remove('subscribedTo', subscribedTo);

    return await user.$add('subscribedTo', subscribedTo);
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
