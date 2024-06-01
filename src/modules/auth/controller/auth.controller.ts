import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  UserData,
  UserAccountDto,
  userAccountSchema,
  UserEmailDto,
  userEmailSchema,
  ZodValidationPipe,
} from 'src/common';
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
import { User } from 'src/modules/user';

@UseGuards(AccountStatusGuard)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AccountStatus(['completed'])
  @Post('login')
  async login(@Body(new ZodValidationPipe(signInSchema)) signInDto: SignInDto) {
    return await this.authService.signIn(signInDto);
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
