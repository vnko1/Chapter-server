import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { UserService } from 'src/modules/user/service';
import { CloudsService } from 'src/modules/clouds/service';
import { User } from 'src/modules/user/model';

import { UpdatePasswordDto, UpdateUserDto } from '../dto';

@Injectable()
export class UsersService extends AppService {
  constructor(
    private userService: UserService,
    private cloudsService: CloudsService,
  ) {
    super();
  }

  private uploadOption: UploadApiOptions = {
    resource_type: 'image',
    folder: 'chapter/avatar',
    overwrite: true,
  };

  private async uploadAvatar(image: Express.Multer.File, id: string) {
    const res = await this.cloudsService.upload(image.path, {
      ...this.uploadOption,
      public_id: id,
    });

    return await this.cloudsService.edit(res.secure_url, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  async deleteUser(id: string) {
    return this.userService.deleteUser({ where: { id } });
  }

  async getUserById(id: string, scope?: UserScope) {
    return this.userService.findUserByPK(
      id,
      {
        include: [
          { model: User, as: 'subscribers' },
          { model: User, as: 'subscribedTo' },
        ],
      },
      scope,
    );
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
      { where: { id: user.id } },
    );
  }

  async updateUser(user: User, updateUserDto: UpdateUserDto) {
    const { image, ...userData } = updateUserDto;

    await this.userService.updateUser(userData, { where: { id: user.id } });

    if (image) {
      user.avatarUrl = await this.uploadAvatar(image, user.id);
      await user.save();
    }
  }

  async subscribeUser(user: User, subscribedToId: string) {
    const subscribedTo = await this.userService.findUserByPK(subscribedToId);
    await user.$add('subscribedTo', subscribedTo);
  }

  async unsubscribeUser(user: User, subscribedToId: string) {
    const subscribedTo = await this.userService.findUserByPK(subscribedToId);
    await user.$remove('subscribedTo', subscribedTo);
  }
}
