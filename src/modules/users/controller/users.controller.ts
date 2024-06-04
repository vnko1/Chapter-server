import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { CredEnum } from 'src/types';
import { AppService } from 'src/common/services';
import { Public, UserData } from 'src/common/decorators';
import { ZodValidationPipe } from 'src/common/pipes';

import { User } from 'src/modules/user/model';

import {
  UpdatePasswordDto,
  updatePasswordSchema,
  UpdateUserDto,
  updateUserSchema,
} from '../dto';
import { UsersService } from '../service';

@Controller('user')
export class UsersController extends AppService {
  constructor(private usersService: UsersService) {
    super();
  }

  @Public()
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get()
  async getMe(@UserData('id') id: string) {
    return await this.usersService.getUserById(id, 'withoutAdminData');
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@UserData('id') id: string, @Res() res: Response) {
    await this.usersService.deleteUser(id);
    return this.deleteCookieResponse(res, CredEnum.Refresh_token).send();
  }

  @Patch()
  async updateUser(
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    return updateUserDto;
  }

  @Patch('password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserPassword(
    @UserData() user: User,
    @Body(new ZodValidationPipe(updatePasswordSchema))
    updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.usersService.changeUserPassword(user, updatePasswordDto);
  }
}
