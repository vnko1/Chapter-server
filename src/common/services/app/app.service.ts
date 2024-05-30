import { ArgumentsHost, HttpStatus } from '@nestjs/common';

export abstract class AppService {
  constructor() {}
  protected response(host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return function (type: string, message: string, status: HttpStatus) {
      return response.status(status).json({
        statusCode: status,
        path: request.url,
        errorType: type,
        errorMessage: message,
      });
    };
  }
}
