import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/modules/user/service';

import { AppService } from '../services';

@Injectable()
export class AuthGuard extends AppService implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserByPK(payload.sub);

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
