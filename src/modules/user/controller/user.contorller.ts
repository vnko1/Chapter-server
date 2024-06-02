import { Controller, Get, Param } from '@nestjs/common';

import { Public, UserData } from 'src/common/decorators';

import { User } from '../model';
import { UserService } from '../service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getMe(@UserData() user: User) {
    return user;
  }

  @Public()
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.findUserByPK(id);
  }
}
