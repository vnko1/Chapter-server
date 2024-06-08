import { Controller } from '@nestjs/common';
import { FeedService } from '../service';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}
}
