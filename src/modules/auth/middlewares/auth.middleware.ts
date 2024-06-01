import { ConflictException, Injectable, NestMiddleware } from '@nestjs/common';
import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/modules/user/model/user.model';

import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const currentPath = req.path;
    const { id } = req.params;
    let user: null | User = null;

    if (currentPath.startsWith('/auth/register/email')) {
      user = await this.userService.findUser({
        where: {
          email: req.body.email,
        },
      });
    }

    if (currentPath.startsWith('/auth/register/confirm') && id) {
      user = await this.userService.findUser({
        where: {
          id,
          accountStatus: {
            [Op.in]: ['confirmed', 'registered'],
          },
        },
      });
    }

    if (user)
      throw new ConflictException(
        `This email already is used; Account status: ${user.accountStatus}`,
      );

    next();
  }
}
