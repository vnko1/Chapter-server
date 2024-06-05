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
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { multerConfig } from 'src/utils';
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
    return await this.usersService.getUserById(id, {
      include: [
        { model: User, as: 'subscribers' },
        { model: User, as: 'subscribedTo' },
      ],
    });
  }

  @Get('/profile/:id')
  async getProfileById(@Param('id') id: string) {
    return await this.usersService.getUserById(
      id,
      undefined,
      'onlyProfileData',
    );
  }

  @Get()
  async getMe(@UserData('id') id: string) {
    return await this.usersService.getUserById(
      id,
      undefined,
      'onlyProfileData',
    );
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

  @Put('subscribe/:subscribedToId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleSubscribe(
    @UserData() user: User,
    @Param('subscribedToId') subscribedToId: string,
  ) {
    return await this.usersService.subscribeToggler(user, subscribedToId);
  }

  @Get('subscribe/subscribers')
  async getUserSubscribers(@UserData('id') id: string) {
    return await this.usersService.getSubscribers(id);
  }

  @Get('subscribe/subscriptions')
  async getUserSubscriptions(@UserData('id') id: string) {
    return await this.usersService.getSubscription(id);
  }
}
