import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { deleteAllFiles, getPath } from 'src/utils';

@Injectable()
export class ClearDataInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(tap(() => deleteAllFiles(getPath('src', 'temp'))));
  }
}
