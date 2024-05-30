import { Body, Controller, Post } from '@nestjs/common';

import { UserEmailDto, userEmailSchema, ZodValidationPipe } from 'src/common';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('register')
  async registerUserEmail(
    @Body(new ZodValidationPipe(userEmailSchema)) userEmailDto: UserEmailDto,
  ) {
    return userEmailDto;
  }
}
