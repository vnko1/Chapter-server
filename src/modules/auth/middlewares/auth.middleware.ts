import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';

import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const currentPath = req.path;
    const { id } = req.params;

    if (currentPath.startsWith('/auth/register/email')) {
      const user = await this.userService.findUser({
        where: {
          email: req.body.email,
        },
      });

      if (user)
        throw new ConflictException(
          `This email already is used; Account status: ${user.accountStatus}`,
        );
    }

    if (currentPath.startsWith('/auth/register/confirm') && id) {
      const user = await this.userService.findUser({
        where: {
          id,
          accountStatus: {
            [Op.in]: ['confirmed', 'completed'],
          },
        },
      });
      if (user)
        throw new ForbiddenException(
          `Forbidden; Account status: ${user.accountStatus}`,
        );
    }

    if (currentPath.startsWith('/auth/register/account') && id) {
      const user = await this.userService.findUser({
        where: {
          id,
          accountStatus: {
            [Op.in]: ['unconfirmed', 'completed'],
          },
        },
      });

      if (user)
        throw new ForbiddenException(
          `Forbidden; Account status: ${user.accountStatus}`,
        );
    }

    next();
  }
}
