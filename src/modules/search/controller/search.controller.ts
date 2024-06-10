import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../service';
import { searchSchema } from '../dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async searchData(@Query('query') query: string) {
    const parsedSchema = searchSchema.safeParse(query);

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.searchService.searchData(parsedSchema.data);
  }
}
