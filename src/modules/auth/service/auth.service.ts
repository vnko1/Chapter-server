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

import { MailService } from 'src/modules/mail';
import { User, UserService } from 'src/modules/user';

import { OTPDto, SignInDto, UserAccountDto, UserEmailDto } from '../dto';

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

  private async generateToken(payload: Payload, expiresIn: string | number) {
    return await this.jwtService.signAsync(payload, {
      expiresIn,
    });
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

  async registerEmail(userEmailDto: UserEmailDto) {
    const otp = this.genOtp();

    await this.mailService.sendEmail(
      this.mailService.mailSendOpt(userEmailDto.email, otp, 'confirmEmail'),
    );

    const { userId } = await this.userService.createUserInstance({
      ...userEmailDto,
      otp,
    });
    return { userId };
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
      { where: { userId: user.userId }, paranoid: false },
    );

    return { userId: user.userId, email: user.email };
  }

  async resentOtp(
    userEmailDto: UserEmailDto,
    sendType: 'confirmEmail' | 'restoreAccount',
  ) {
    const otp = this.genOtp();

    const sendOpt = this.mailService.mailSendOpt(
      userEmailDto.email,
      otp,
      sendType,
    );

    await this.mailService.sendEmail(sendOpt);

    await this.userService.updateUser(
      { otp },
      { where: { email: userEmailDto.email }, paranoid: false },
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

  async createAccount(userAccountDto: UserAccountDto, userId: string) {
    return await this.userService.updateUser(
      { ...userAccountDto, accountStatus: 'completed' },
      { where: { userId } },
    );
  }

  async signIn(userData: User, signInDto: SignInDto) {
    const isValidPass = await this.checkPassword(
      signInDto.password,
      userData.password,
    );

    if (!isValidPass)
      throw new UnauthorizedException('Wrong email or password');
    const payload = {
      sub: userData.userId,
    };
    return await this.createCred(payload);
  }

  async passRestore(user: User) {
    const otp = this.genOtp(10);
    user.otp = otp;
    await user.save();

    return await this.mailService.sendEmail(
      this.mailService.mailSendOpt(user.email, otp, 'restorePassword'),
    );
  }

  async passUpdate(user: User, password: string) {
    return this.userService.updateUser(
      { password, otp: null },
      { where: { userId: user.userId } },
    );
  }

  async sendRestoreOtp(user: User) {
    const otp = this.genOtp();

    await this.mailService.sendEmail(
      this.mailService.mailSendOpt(user.email, otp, 'restoreAccount'),
    );

    user.otp = otp;
    user.accountStatus = 'restoring';
    await user.save();

    return user;
  }

  async restoreAcc(userData: User, otpDto: OTPDto) {
    const user = await this.userValidation(
      userData,
      'otp',
      otpDto.otp,
      'Invalid otp',
      400,
    );
    await this.userService.restoreUser({ where: { userId: user.userId } });
    return this.userService.updateUser(
      {
        otp: null,
        accountStatus: 'completed',
      },
      { where: { userId: user.userId } },
    );
  }
}
