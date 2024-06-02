import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { generate } from 'otp-generator';

import { AppService } from 'src/common/services';
import { UserAccountDto, UserEmailDto } from 'src/common/dto';

import { MailService } from 'src/modules/mail/service';
import { User } from 'src/modules/user/model';
import { UserService } from 'src/modules/user/service';

import { OTPDto, SignInDto } from '../dto';

interface Options {
  digits?: boolean;
  lowerCaseAlphabets?: boolean;
  upperCaseAlphabets?: boolean;
  specialChars?: boolean;
}
type Payload = { sub: string; tokenId?: string };

@Injectable()
export class AuthService extends AppService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async signIn(userData: User, signInDto: SignInDto) {
    const isValidPass = await this.checkPassword(
      signInDto.password,
      userData.password,
    );
    if (!isValidPass)
      throw new UnauthorizedException('Wrong email or password');
    const payload = {
      sub: userData.id,
    };
    return await this.createCred(payload);
  }

  async registerEmail(userEmailDto: UserEmailDto) {
    const otp = this.genOtp();

    const user = await this.userService.createUserInstance({
      ...userEmailDto,
      otp,
    });

    await this.mailService.sendEmail(
      this.otpMailSendOpt(userEmailDto.email, otp),
    );

    return { id: user.id };
  }

  async sendRestoreOtp(userEmailDto: UserEmailDto) {
    const otp = this.genOtp();
    const user = await this.userService.updateUser(
      { otp, accountStatus: 'restoring' },
      { where: { email: userEmailDto.email }, paranoid: false },
    );

    await this.mailService.sendEmail(
      this.restoreMailSendOpt(userEmailDto.email, otp),
    );

    return user;
  }

  async resentOtp(userEmailDto: UserEmailDto, sendType: 'confirm' | 'restore') {
    const otp = this.genOtp();

    await this.userService.updateUser(
      { otp },
      { where: { email: userEmailDto.email }, paranoid: false },
    );

    const sendOpt =
      sendType === 'confirm'
        ? this.otpMailSendOpt(userEmailDto.email, otp)
        : this.restoreMailSendOpt(userEmailDto.email, otp);

    await this.mailService.sendEmail(sendOpt);
  }

  async confirmEmail(userData: User, otpDto: OTPDto) {
    const user = await this.userValidation(
      userData,
      'otp',
      otpDto.otp,
      'Invalid otp',
      400,
    );

    await this.userService.updateUser(
      {
        otp: null,
        accountStatus: 'confirmed',
      },
      { where: { id: user.id }, paranoid: false },
    );

    return { id: user.id, email: user.email };
  }

  async restoreAcc(userData: User, otpDto: OTPDto) {
    const user = await this.userValidation(
      userData,
      'otp',
      otpDto.otp,
      'Invalid otp',
      400,
    );
    await this.userService.restoreUser({ where: { id: user.id } });
    return this.userService.updateUser(
      {
        otp: null,
        accountStatus: 'completed',
      },
      { where: { id: user.id } },
    );
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

  async createCred(payload: Payload) {
    const access_token = await this.generateToken(
      payload,
      process.env.JWT_ACCESS_EXPIRES,
    );
    const refresh_token = await this.generateToken(
      {
        ...payload,
        tokenId: randomUUID(),
      },
      process.env.JWT_REFRESH_EXPIRES,
    );

    return {
      access_token,
      refresh_token,
    };
  }

  private async userValidation(
    user: User,
    fieldName: string,
    fieldValue: string,
    errorMessage: string,
    httpStatus: number,
  ) {
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
      template: 'otp',
      context: {
        title: 'Chapter',
        text1: 'Welcome to chapter application!',
        text2: 'To confirm your email, please enter this one-time password: ',
        text3: otp,
      },
    };
  }

  private restoreMailSendOpt(email: string, otp: string) {
    return {
      to: email,
      subject: 'Restore your account',
      template: 'otp',
      context: {
        title: 'Chapter',
        text1: 'Welcome to chapter application!',
        text2: 'To restore your account, please enter this one-time password: ',
        text3: otp,
      },
    };
  }

  private async generateToken(payload: Payload, expiresIn: string | number) {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }
}
