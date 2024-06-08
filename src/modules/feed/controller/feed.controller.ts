import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { LIMIT } from 'src/utils';

import { FeedService } from '../service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @Get()
  async getFeeds(
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return await this.feedService.getPosts(offset, limit);
  }
}
