import { Injectable, NestMiddleware } from '@nestjs/common';
import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';

import { UserService } from 'src/modules/user';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const { email } = req.body;
    const { id } = req.params;

    const user = await this.userService.findUser(
      {
        where: { [Op.or]: [{ email: email || '' }, { id: id || '' }] },
      },
      'withoutSensitiveData',
    );

    req['user'] = user;

    next();
  }
}
