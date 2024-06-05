import { Injectable } from '@nestjs/common';

import { AppService } from 'src/common/services';
import { PostService } from 'src/modules/post/service';

@Injectable()
export class PostsService extends AppService {
  constructor(private postService: PostService) {
    super();
  }
}
