import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { generate } from 'otp-generator';

import { AppService, UserAccountDto, UserEmailDto } from 'src/common';
import { UserService } from 'src/modules/user/service/user.service';
import { OTPDto } from '../dto/otp.dto';
import { MailService } from 'src/modules/mail/service/mail.service';

interface Options {
  digits?: boolean;
  lowerCaseAlphabets?: boolean;
  upperCaseAlphabets?: boolean;
  specialChars?: boolean;
}

@Injectable()
export class AuthService extends AppService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
  ) {
    super();
  }

  async getTempUser(id: string) {
    return await this.userService.findUserByPK(id);
  }

  async registerEmail(userEmailDto: UserEmailDto) {
    const otp = this.genOtp();

    await this.mailService.sendEmail(
      this.otpMailSendOpt(userEmailDto.email, otp),
    );
    const user = await this.userService.createUserInstance({
      ...userEmailDto,
      otp,
    });
    return { id: user.id };
  }

  async confirmEmail(id: string, otpDto: OTPDto) {
    const user = await this.userValidation(
      id,
      'otp',
      otpDto.otp,
      'Invalid otp',
      400,
    );

    user.accountStatus = 'confirmed';
    user.otp = null;
    await user.save();

    return { id: user.id, email: user.email };
  }

  async nickNameValidate(nickName: string) {
    const user = await this.userService.findUser({ where: { nickName } });
    if (user)
      throw new HttpException(
        `User with nickname: ${nickName}, already exists`,
        HttpStatus.CONFLICT,
      );
    return user;
  }

  async createAccount(userAccountDto: UserAccountDto, id: string) {
    return await this.userService.updateUser(
      { ...userAccountDto, accountStatus: 'completed' },
      { where: { id } },
    );
  }

  private async userValidation(
    id: string,
    fieldName: string,
    fieldValue: string,
    errorMessage: string,
    httpStatus: number,
  ) {
    const user = await this.userService.findUserByPK(id);
    if (!user)
      throw new HttpException(
        `User with id: ${id} not exists.`,
        HttpStatus.ACCEPTED,
      );
    if (user[fieldName] !== fieldValue)
      throw new HttpException(errorMessage, httpStatus);

    return user;
  }

  private genOtp(length = 4, options?: Options) {
    const defaultOptions: Options = { specialChars: false, ...options };
    return generate(length, defaultOptions);
  }

  private otpMailSendOpt(email: string, otp: string) {
    return {
      to: email,
      subject: 'Confirm your email',
      template: 'acc-activate',
      context: {
        title: 'Chapter',
        text1: 'Welcome to chapter application!',
        text2: 'To confirm your email, please enter this one-time password: ',
        text3: otp,
      },
    };
  }
}
