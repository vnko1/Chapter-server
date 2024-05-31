import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { UserEmailDto, userEmailSchema, ZodValidationPipe } from 'src/common';
import { AuthService } from '../service/auth.service';
import { OTPDto, otpSchema } from '../dto/otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUserEmail(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.registerEmail(userEmailDto);
  }

  @Post('confirm')
  async confirmEmail(@Body(new ZodValidationPipe(otpSchema)) otpDto: OTPDto) {
    return await this.authService.confirmEmail(otpDto);
  }
}
