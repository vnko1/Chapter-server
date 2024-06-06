import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AppService } from 'src/common/services';

import { User } from 'src/modules/user/model';

@Injectable()
export class PostGuard extends AppService implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { id } = request.params;
    const user = request.user as User;
    const isOwnPost = await user.$has('posts', id);
    if (!isOwnPost) throw new ForbiddenException();
    return true;
  }
}
