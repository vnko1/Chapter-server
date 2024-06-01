import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppService } from '../services';
import { UserService } from 'src/modules/user/service';

@Injectable()
export class RTokenGuard extends AppService implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rToken = this.extractTokenFromCookies(request, 'refresh_token');

    if (!rToken) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(rToken, {
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
