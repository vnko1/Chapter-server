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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
import { diskStorage } from 'multer';
import { multerConfig } from 'src/utils';

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
  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUser(
    @UserData() user: User,
    @Body()
    updateUserDto: UpdateUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsedSchema = updateUserSchema.safeParse({
      ...updateUserDto,
      image,
    });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.usersService.updateUser(user, parsedSchema.data);
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
