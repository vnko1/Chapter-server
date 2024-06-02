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
import { Response } from 'express';

import { AppService } from 'src/common/services';
import { ZodValidationPipe } from 'src/common/pipes';
import { Public, UserData } from 'src/common/decorators';
import {
  UserAccountDto,
  userAccountSchema,
  UserEmailDto,
  userEmailSchema,
} from 'src/common/dto';

import { User } from 'src/modules/user/model';

import { AuthService } from '../service';
import { AccountStatusGuard } from '../guards';
import { AccountStatus } from '../decorators';

import {
  NickNameDto,
  nickNameSchema,
  OTPDto,
  otpSchema,
  SignInDto,
  signInSchema,
} from '../dto';

@UseGuards(AccountStatusGuard)
@Controller('auth')
export class AuthController extends AppService {
  constructor(private authService: AuthService) {
    super();
  }

  @AccountStatus(['completed'])
  @Public()
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

  @Public()
  @Post('register/email')
  @HttpCode(HttpStatus.OK)
  async registerUserEmail(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.registerEmail(userEmailDto);
  }

  @Public()
  @AccountStatus(['unconfirmed'])
  @Post('register/confirm/:id')
  async confirmEmail(
    @UserData() user: User,
    @Body(new ZodValidationPipe(otpSchema))
    otpDto: OTPDto,
  ) {
    return await this.authService.confirmEmail(user, otpDto);
  }

  @Public()
  @Get('register/nickname')
  @HttpCode(HttpStatus.NO_CONTENT)
  async nickNameValidation(
    @Body(new ZodValidationPipe(nickNameSchema)) nickNameDto: NickNameDto,
  ) {
    return await this.authService.nickNameValidate(nickNameDto.nickName);
  }
  @Public()
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

  @Public()
  @Post('register/otp')
  @AccountStatus(['unconfirmed'])
  async resentOtp(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.resentOtp(userEmailDto);
  }
}
