import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CredEnum } from 'src/types';
import { AppService } from 'src/common/services';
import { ZodValidationPipe } from 'src/common/pipes';
import { AccountStatus, Public, RToken, UserData } from 'src/common/decorators';

import { AccountGuard } from 'src/common/guards';

import { User } from 'src/modules/user';

import { AuthService } from '../service';
import {
  NickNameDto,
  nickNameSchema,
  OTPDto,
  otpSchema,
  PasswordDto,
  passwordSchema,
  SignInDto,
  signInSchema,
  UserAccountDto,
  userAccountSchema,
  UserEmailDto,
  userEmailSchema,
} from '../dto';
import { GoogleOauthGuard } from '../guards';

@UseGuards(AccountGuard)
@Controller('auth')
export class AuthController extends AppService {
  constructor(private authService: AuthService) {
    super();
  }

  @Get('google')
  @Public()
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @Public()
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const cred = await this.authService.googleLogin(req);
    if ('access_token' in cred && 'refresh_token' in cred)
      return res.redirect(
        `${process.env.CLIENT_URL}/auth/login/?access_token=${cred.access_token}&refresh_token=${cred.refresh_token}`,
      );

    return res.redirect(
      `${process.env.CLIENT_URL}/auth/account-creation/${cred.userId}`,
    );
  }

  @AccountStatus(['completed'])
  @Public()
  @Post('login')
  async login(
    @UserData() user: User,
    @Body(new ZodValidationPipe(signInSchema)) signInDto: SignInDto,
  ) {
    return await this.authService.signIn(user, signInDto);
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
  @Post('register/confirm/:userId')
  async confirmEmail(
    @UserData() user: User,
    @Body(new ZodValidationPipe(otpSchema))
    otpDto: OTPDto,
  ) {
    return await this.authService.confirmEmail(user, otpDto);
  }

  @Public()
  @Post('register/nickname')
  @HttpCode(HttpStatus.NO_CONTENT)
  async nickNameValidation(
    @Body(new ZodValidationPipe(nickNameSchema)) nickNameDto: NickNameDto,
  ) {
    return await this.authService.nickNameValidate(nickNameDto.nickName);
  }
  @Public()
  @Patch('register/account/:userId')
  @AccountStatus(['confirmed'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async createUserAccount(
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(userAccountSchema))
    userAccountDto: UserAccountDto,
  ) {
    return await this.authService.createAccount(userAccountDto, userId);
  }

  @Public()
  @Post('register/otp')
  @AccountStatus(['unconfirmed'])
  @HttpCode(HttpStatus.NO_CONTENT)
  async resentOtp(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.resentOtp(userEmailDto, 'confirmEmail');
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res() res: Response) {
    return this.deleteCookieResponse(res, CredEnum.Refresh_token).send();
  }

  @RToken()
  @Post('refresh')
  async refreshAccessToken(@UserData() user: User) {
    return await this.authService.createCred({ sub: user.userId });
  }

  @Public()
  @Post('restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AccountStatus(['deleted'])
  async restoreUser(
    @Body(new ZodValidationPipe(userEmailSchema)) _,
    @UserData() user: User,
  ) {
    return await this.authService.sendRestoreOtp(user);
  }

  @Public()
  @Post('restore/otp')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AccountStatus(['restoring'])
  async resentRestoreOtp(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.resentOtp(userEmailDto, 'restoreAccount');
  }

  @Public()
  @Post('restore/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @AccountStatus(['restoring'])
  async confirmAccRestore(
    @UserData() user: User,
    @Body(new ZodValidationPipe(otpSchema))
    otpDto: OTPDto,
  ) {
    return await this.authService.restoreAcc(user, otpDto);
  }

  @Public()
  @Post('pass-reset')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Body(new ZodValidationPipe(userEmailSchema)) _,
    @UserData() user: User,
  ) {
    return await this.authService.passRestore(user);
  }

  @Public()
  @Patch('pass-upd')
  @HttpCode(HttpStatus.NO_CONTENT)
  async saveNewPass(
    @Body(new ZodValidationPipe(passwordSchema)) passwordDto: PasswordDto,
    @UserData() user: User,
  ) {
    return await this.authService.passUpdate(user, passwordDto.password);
  }
}
