import { Controller, Get, Param } from '@nestjs/common';

import { Public } from 'src/common/decorators';

import { User } from 'src/modules/user';
import { Post } from 'src/modules/post';

import { AdminService } from '../service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Public()
  @Get('user/:userId')
  async getUser(@Param('userId') userId: string) {
    return await this.adminService.getUserById(userId, {
      include: [
        { model: User, as: 'subscribers' },
        { model: User, as: 'subscribedTo' },
        { model: Post, as: 'posts' },
      ],
    });
  }
}
