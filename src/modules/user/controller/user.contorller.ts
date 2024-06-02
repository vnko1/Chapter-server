import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { CredEnum } from 'src/types';
import { AppService } from 'src/common/services';
import { Public, UserData } from 'src/common/decorators';

import { User } from '../model';
import { UserService } from '../service';

@Controller('user')
export class UserController extends AppService {
  constructor(private userService: UserService) {
    super();
  }

  @Get()
  async getMe(@UserData() user: User) {
    return user;
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@UserData('id') id: string, @Res() res: Response) {
    await this.userService.deleteUser({ where: { id } });
    return this.deleteCookieResponse(res, CredEnum.Refresh_token).send();
  }

  @Public()
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.findUserByPK(id);
  }
}
