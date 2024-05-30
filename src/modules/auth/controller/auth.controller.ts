import { Body, Controller, Post } from '@nestjs/common';

import { UserEmailDto, userEmailSchema, ZodValidationPipe } from 'src/common';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async registerUserEmail(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return await this.authService.createUser(userEmailDto);
  }
}
