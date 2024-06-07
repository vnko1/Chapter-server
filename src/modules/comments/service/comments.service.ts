import { Injectable } from '@nestjs/common';

import { AppService } from 'src/common/services';

import { CommentService } from 'src/modules/comment/service';
import { LikeService } from 'src/modules/like/service';
import { PostService } from 'src/modules/post/service';

@Injectable()
export class CommentsService extends AppService {
  constructor(
    private commentService: CommentService,
    private likeService: LikeService,
    private postService: PostService,
  ) {
    super();
  }
}
