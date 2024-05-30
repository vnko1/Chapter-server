import { Injectable } from '@nestjs/common';
import { AppService, UserEmailDto } from 'src/common';
import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class AuthService extends AppService {
  constructor(private userService: UserService) {
    super();
  }

  async createUser(userEmailDto: UserEmailDto) {
    return await this.userService.registerEmail(userEmailDto);
  }
}
