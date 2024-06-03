import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AccountStatus } from '../../decorators';
import { User } from 'src/modules/user/model';

@Injectable()
export class AccountGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const accountStatus = this.reflector.get(
      AccountStatus,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return this.validatePattern(request.path, user, accountStatus);
  }

  private validatePattern(
    path: string,
    user: User | null,
    accountStatus: string[],
  ) {
    if (path.startsWith('/auth/register/email') && user)
      throw new ConflictException(
        `This email already is used; Account status: ${user.deletedAt !== null ? 'deleted' : user.accountStatus}`,
      );

    if (path.startsWith('/auth/restore/confirm') && !user)
      throw new BadRequestException('Invalid otp');

    if (path.startsWith('/auth/login') || path.startsWith('/auth/pass-reset')) {
      if (!user) throw new UnauthorizedException('Wrong email or password');
      if (user.deletedAt !== null)
        throw new ForbiddenException(`Forbidden; Account status: deleted`, {
          description: `Deleted at: ${user.deletedAt}`,
        });
    }

    if (!accountStatus) return true;

    if (!user) throw new NotFoundException('User not exists');

    if (accountStatus.includes('deleted')) {
      if (user.deletedAt === null)
        throw new ForbiddenException(
          `Forbidden; Account status: ${user.accountStatus}`,
        );
      return true;
    }

    if (!accountStatus.includes(user.accountStatus))
      throw new ForbiddenException(
        `Forbidden; Account status: ${user.accountStatus}`,
      );

    return true;
  }
}
