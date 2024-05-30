import { Injectable } from '@nestjs/common';
import { generate } from 'otp-generator';
import { AppService, UserEmailDto } from 'src/common';
import { UserService } from 'src/modules/user/service/user.service';

interface Options {
  digits?: boolean;
  lowerCaseAlphabets?: boolean;
  upperCaseAlphabets?: boolean;
  specialChars?: boolean;
}

@Injectable()
export class AuthService extends AppService {
  constructor(private userService: UserService) {
    super();
  }

  async registerEmail(userEmailDto: UserEmailDto) {
    return await this.userService.createUserInstance({
      ...userEmailDto,
      otp: this.genOtp(),
    });
  }

  private genOtp(length = 4, options?: Options) {
    const defaultOptions: Options = { specialChars: false, ...options };
    return generate(length, defaultOptions);
  }
}
