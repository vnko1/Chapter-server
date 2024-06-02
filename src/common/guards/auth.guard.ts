import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AppService } from '../services';
import { IS_PUBLIC_KEY, REFRESH_TOKEN } from '../decorators';
import { UserService } from 'src/modules/user/service';

@Injectable()
export class AuthGuard extends AppService implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const authStrategy = this.reflector.getAllAndOverride<string>(
      REFRESH_TOKEN,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();

    const token =
      authStrategy === REFRESH_TOKEN
        ? this.extractTokenFromCookies(request, authStrategy)
        : this.extractTokenFromHeader(request);

    if (!token) throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      const user = await this.userService.findUserByPK(
        payload.sub,
        undefined,
        'withoutSensitiveAndAccStatusData',
      );

      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
