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

    const user = await this.userService.createUserInstance({
      ...userEmailDto,
      otp,
    });

    await this.mailService.sendEmail(
      this.mailService.mailSendOpt(userEmailDto.email, otp, 'confirmEmail'),
    );

    return { id: user.id };
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

  async resentOtp(
    userEmailDto: UserEmailDto,
    sendType: 'confirmEmail' | 'restoreAccount',
  ) {
    const otp = this.genOtp();

    await this.userService.updateUser(
      { otp },
      { where: { email: userEmailDto.email }, paranoid: false },
    );

    const sendOpt = this.mailService.mailSendOpt(
      userEmailDto.email,
      otp,
      sendType,
    );

    await this.mailService.sendEmail(sendOpt);
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
      { where: { id: user.id } },
    );
  }

  async sendRestoreOtp(user: User) {
    const otp = this.genOtp();

    user.otp = otp;
    user.accountStatus = 'restoring';
    await user.save();

    await this.mailService.sendEmail(
      this.mailService.mailSendOpt(user.email, otp, 'restoreAccount'),
    );

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
    await this.userService.restoreUser({ where: { id: user.id } });
    return this.userService.updateUser(
      {
        otp: null,
        accountStatus: 'completed',
      },
      { where: { id: user.id } },
    );
  }
}
