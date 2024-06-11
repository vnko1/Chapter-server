import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { AppService } from 'src/common/services';

import { User } from 'src/modules/user/model';

@Injectable()
export class DataGuard extends AppService implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [key] = Object.keys(request.params);

    const user = request.user as User;

    const isOwn = await user.$has(
      this.getPropertyKey(key),
      request.params[key],
    );

    if (!isOwn) throw new ForbiddenException();
    return true;
  }

  private getPropertyKey(key: string) {
    if (key === 'postId') return 'posts';
    if (key === 'bookId') return 'userBooks';
    if (key === 'notsId') return 'userNots';
    return 'userComments';
  }
}
