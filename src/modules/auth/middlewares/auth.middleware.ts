import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const user = await this.userService.findUser({
      where: {
        email: req.body.email,
      },
    });
    if (user)
      throw new ConflictException(
        `This email already is used; Account status: ${user.accountStatus}`,
      );
    next();
  }
}
