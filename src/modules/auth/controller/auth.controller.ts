import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import {
  UserData,
  UserAccountDto,
  userAccountSchema,
  UserEmailDto,
  userEmailSchema,
  ZodValidationPipe,
  AppService,
} from 'src/common';

import { User } from 'src/modules/user';
import {
  AuthService,
  OTPDto,
  otpSchema,
  NickNameDto,
  nickNameSchema,
  AccountStatus,
  AccountStatusGuard,
  SignInDto,
  signInSchema,
} from '..';
import { Response } from 'express';

@UseGuards(AccountStatusGuard)
@Controller('auth')
export class AuthController extends AppService {
  constructor(private authService: AuthService) {
    super();
  }

  @AccountStatus(['completed'])
  @Post('login')
  async login(
    @UserData() user: User,
    @Body(new ZodValidationPipe(signInSchema)) signInDto: SignInDto,
    @Res() res: Response,
  ) {
    const cred = await this.authService.signIn(user, signInDto);
    return this.cookieResponse(res, cred, +process.env.REFRESH_TOKEN_AGE).send({
      access_token: cred.access_token,
    });
  }

  @Post('register/email')
  @HttpCode(HttpStatus.OK)
  async registerUserEmail(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.registerEmail(userEmailDto);
  }

  @Post('register/confirm/:id')
  @AccountStatus(['unconfirmed'])
  async confirmEmail(
    @UserData() user: User,
    @Body(new ZodValidationPipe(otpSchema))
    otpDto: OTPDto,
  ) {
    return await this.authService.confirmEmail(user, otpDto);
  }

  @Get('register/nickname')
  @HttpCode(HttpStatus.NO_CONTENT)
  async nickNameValidation(
    @Body(new ZodValidationPipe(nickNameSchema)) nickNameDto: NickNameDto,
  ) {
    return await this.authService.nickNameValidate(nickNameDto.nickName);
  }

  @Patch('register/account/:id')
  @AccountStatus(['confirmed'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async createUserAccount(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(userAccountSchema))
    userAccountDto: UserAccountDto,
  ) {
    return await this.authService.createAccount(userAccountDto, id);
  }

  @Post('register/otp')
  @AccountStatus(['unconfirmed'])
  async resentOtp(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.resentOtp(userEmailDto);
  }

  @Get('user/:id')
  async getUserTemp(@Param('id') id: string) {
    return await this.authService.getTempUser(id);
  }
}
