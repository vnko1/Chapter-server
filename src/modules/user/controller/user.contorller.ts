import { Controller, Get } from '@nestjs/common';
import { UserData } from 'src/common/decorators';
import { User } from '../model';

@Controller('user')
export class UserController {
  constructor() {}

  @Get()
  async getMe(@UserData() user: User) {
    return user;
  }
}
