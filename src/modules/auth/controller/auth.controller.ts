import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserEmailDto, userEmailSchema, ZodValidationPipe } from 'src/common';
import { AuthService } from '../service/auth.service';
import { OTPDto, otpSchema } from '../dto/otp.dto';
import { NickNameDto, nickNameSchema } from '../dto/nickName.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register/email')
  @HttpCode(HttpStatus.OK)
  async registerUserEmail(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.registerEmail(userEmailDto);
  }

  @Post('register/confirm/:id')
  async confirmEmail(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(otpSchema)) otpDto: OTPDto,
  ) {
    return await this.authService.confirmEmail(id, otpDto);
  }

  @Get('register/nickname')
  @HttpCode(HttpStatus.NO_CONTENT)
  async nickNameValidation(
    @Body(new ZodValidationPipe(nickNameSchema)) nickNameDto: NickNameDto,
  ) {
    return await this.authService.nickNameValidate(nickNameDto.nickName);
  }

  @Patch('register/account/:id')
  async createUserAccount() {}

  @Get('user/:id')
  async getUserTemp(@Param('id') id: string) {
    return await this.authService.getTempUser(id);
  }
}
