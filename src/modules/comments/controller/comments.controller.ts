import { Controller } from '@nestjs/common';

import { CommentsService } from '../service';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
}
