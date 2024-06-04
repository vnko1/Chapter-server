import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { deleteAllFiles, getPath } from 'src/utils';

@Injectable()
export class ClearDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return (
      next
        .handle()
        // .pipe(catchError(async (error) => console.log(error)))
        .pipe(tap(() => deleteAllFiles(getPath('src', 'temp'))))
    );
  }
}
