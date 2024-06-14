import { Injectable, NestMiddleware } from '@nestjs/common';
import { Op } from 'sequelize';
import { Request, Response, NextFunction } from 'express';
import { UserService } from 'src/modules/user/service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private userService: UserService) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const { email, otp } = req.body;

    const { userId } = req.params;

    const user = await this.userService.findUser({
      where: {
        [Op.or]: [
          { email: email || '' },
          { userId: userId || '' },
          { otp: otp || '' },
        ],
      },
      paranoid: false,
    });

    req['user'] = user;

    next();
  }
}
