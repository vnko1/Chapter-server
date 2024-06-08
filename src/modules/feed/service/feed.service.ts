import { Injectable } from '@nestjs/common';
import { AppService } from 'src/common/services';

@Injectable()
export class FeedService extends AppService {
  constructor() {
    super();
  }
}
