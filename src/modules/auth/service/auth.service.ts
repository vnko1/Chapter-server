import { BadRequestException, Injectable } from '@nestjs/common';
import { generate } from 'otp-generator';

import { AppService, UserEmailDto } from 'src/common';
import { UserService } from 'src/modules/user/service/user.service';
import { OTPDto } from '../dto/otp.dto';

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

  async confirmEmail(otpDto: OTPDto) {
    const user = await this.otpValidation(otpDto.otp);
    user.accountStatus = 'confirmed';
    user.otp = null;
    await user.save();

    return { id: user.id, email: user.email };
  }

  private async otpValidation(otp: string) {
    const user = await this.userService.findUser({ where: { otp } });
    if (!user) throw new BadRequestException('Invalid otp');

    return user;
  }

  private genOtp(length = 4, options?: Options) {
    const defaultOptions: Options = { specialChars: false, ...options };
    return generate(length, defaultOptions);
  }
}
