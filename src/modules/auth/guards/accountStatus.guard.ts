import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccountStatus } from '..';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const accountStatus = this.reflector.get(
      AccountStatus,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (request.path.startsWith('/auth/register/email') && user) {
      throw new ConflictException(
        `This email already is used; Account status: ${user.accountStatus}`,
      );
    }

    if (!accountStatus) return true;

    if (!user) throw new NotFoundException('User not exists');

    if (user && !accountStatus.includes(user.accountStatus))
      throw new ForbiddenException(
        `Forbidden; Account status: ${user.accountStatus}`,
      );

    return true;
  }
}
