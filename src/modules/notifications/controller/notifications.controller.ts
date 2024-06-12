import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { UserData } from 'src/common/decorators';
import { DataGuard } from 'src/common/guards';
import { NotificationsService } from '../services';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getAll(@UserData('userId') userId: string) {
    return await this.notificationsService.getAllNots(userId);
  }

  @UseGuards(DataGuard)
  @Patch(':notsId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setViewed(@Param('notsId') notsId: string) {
    return await this.notificationsService.setAsReadNots(notsId);
  }

  @UseGuards(DataGuard)
  @Delete(':notsId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNots(@Param('notsId') notsId: string) {
    return await this.notificationsService.deleteNot(notsId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllNots(@UserData('userId') userId: string) {
    return await this.notificationsService.deleteAllNots(userId);
  }
}
