import { Controller, Get } from '@nestjs/common';

import { BaseService } from '../service/base.service';

@Controller()
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get()
  getHello(): string {
    return this.baseService.getHello();
  }
}
