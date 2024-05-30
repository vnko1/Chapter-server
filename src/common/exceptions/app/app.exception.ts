import { Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class AppHttpExceptionFilter implements ExceptionFilter {
  catch() {}
}
