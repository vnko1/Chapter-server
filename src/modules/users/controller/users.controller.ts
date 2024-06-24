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
import { UserData } from 'src/common/decorators';
import { ZodValidationPipe } from 'src/common/pipes';

import { User } from 'src/modules/user';

import {
  UpdatePasswordDto,
  updatePasswordSchema,
  UpdateUserDto,
  updateUserSchema,
} from '../dto';
import { UsersService } from '../service';

@Controller('users')
export class UsersController extends AppService {
  constructor(private usersService: UsersService) {
    super();
  }

  @Get('profile/:userId')
  async getProfileById(@Param('userId') userId: string) {
    return await this.usersService.getUserById(
      userId,
      undefined,
      'publicScopeAndSubscribersId',
    );
  }

  @Get()
  async getMe(@UserData('userId') userId: string) {
    return await this.usersService.getUserById(
      userId,
      undefined,
      'privateScopeAndSubscribersId',
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@UserData('userId') userId: string, @Res() res: Response) {
    await this.usersService.deleteUser(userId);
    return this.deleteCookieResponse(res, CredEnum.Refresh_token).send();
  }

  @Patch()
  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
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
  async toggleSubscribe(
    @UserData('userId') userId: string,
    @Param('subscribedToId') subscribedToId: string,
  ) {
    return await this.usersService.subscribeToggler(userId, subscribedToId);
  }

  @Get('subscribe/subscribers')
  async getUserSubscribers(@UserData('userId') userId: string) {
    return await this.usersService.getSubscribers(userId);
  }

  @Get('subscribe/subscriptions')
  async getUserSubscriptions(@UserData('userId') userId: string) {
    return await this.usersService.getSubscription(userId);
  }
}
