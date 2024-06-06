import { Injectable } from '@nestjs/common';

import { AppService } from 'src/common/services';
import { CommentService } from 'src/modules/comment/service';

@Injectable()
export class CommentsService extends AppService {
  constructor(private commentService: CommentService) {
    super();
  }
}
