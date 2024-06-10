import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async searchData(@Query('query') query: string) {
    return await this.searchService.searchData(query);
  }
}
