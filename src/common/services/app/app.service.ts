import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

import { ICred } from 'src/types';

export abstract class AppService {
  constructor() {}

  protected async checkPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
  }
  protected exceptionResponse(host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return function (
      type: string,
      message: string,
      status: HttpStatus,
      description?: string,
    ) {
      const errorResponse = {
        statusCode: status,
        path: request.url,
        errorType: type,
        errorMessage: message,
      };
      if (description) errorResponse['data'] = description;
      return response.status(status).json(errorResponse);
    };
  }

  protected setCookieResponse(res: Response, cred: ICred, maxAge: number) {
    res.cookie('refresh_token', cred.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge,
    });
    return res;
  }

  protected deleteCookieResponse(res: Response, name: string) {
    return res.cookie(name, '', {
      httpOnly: true,
      secure: true,
      maxAge: -1,
      sameSite: 'none',
    });
  }

  protected extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  protected extractTokenFromCookies(request: Request, name: string) {
    console.log(
      '🚀 ~ AppService ~ extractTokenFromCookies ~ request:',
      request.cookies,
    );
    return request.cookies[name];
  }

  protected extractTokenFromBody(request: Request, name: string) {
    return request.body[name];
  }
}
