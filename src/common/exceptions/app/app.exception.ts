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
    const response = this.exceptionResponse(host);

    const status = this.status(exception);

    const errorDescription =
      exception.getResponse && exception.getResponse()['error'];

    if (exception.message)
      response('Error', exception.message, status, errorDescription);
    else response(exception.name, exception.message, status);
  }

  private status(exception: any) {
    if (exception instanceof HttpException) return exception.getStatus();
    if (exception instanceof Error) {
      if (exception.message.startsWith('Validation error')) return 400;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
