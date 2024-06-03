import { Injectable, UnauthorizedException } from '@nestjs/common';

import { UserScope } from 'src/types';
import { AppService } from 'src/common/services';

import { UserService } from 'src/modules/user/service';
import { User } from 'src/modules/user/model';

import { UpdatePasswordDto } from '../dto';

@Injectable()
export class UsersService extends AppService {
  constructor(private userService: UserService) {
    super();
  }

  async deleteUser(id: string) {
    return this.userService.deleteUser({ where: { id } });
  }

  async getUserById(id: string, scope?: UserScope) {
    return this.userService.findUserByPK(id, undefined, scope);
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
}
