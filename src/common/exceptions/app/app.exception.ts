import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from 'src/common/services';

@Catch()
export class AppHttpExceptionFilter
  extends AppService
  implements ExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = this.response(host);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.message) response('Error', exception.message, status);
    else response(exception.name, exception.message, status);
  }
}
