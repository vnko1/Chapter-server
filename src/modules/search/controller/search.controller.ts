import { Controller, Get, Query } from '@nestjs/common';

@Controller('search')
export class SearchController {
  constructor() {}

  @Get()
  async searchData(@Query('query') query: string) {
    return query;
  }
}
