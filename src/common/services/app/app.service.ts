import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { ICred } from 'src/types';

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

  protected cookieResponse(res: Response, cred: ICred, maxAge: number) {
    res.cookie('refresh_token', cred.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
    });
    return res;
  }
}
