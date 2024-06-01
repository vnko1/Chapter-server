import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export abstract class AppService {
  constructor() {}

  protected async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
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
