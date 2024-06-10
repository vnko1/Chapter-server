import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { LIMIT } from 'src/utils';

import { SearchService } from '../service';
import { searchSchema } from '../dto';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async searchData(
    @Query('query') query: string,
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    const parsedSchema = searchSchema.safeParse(query);

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.searchService.searchData(
      parsedSchema.data,
      offset,
      limit,
    );
  }
}
