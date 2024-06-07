import { Body, Controller, Post } from '@nestjs/common';

import { CommentsService } from '../service';
import { ZodValidationPipe } from 'src/common/pipes';
import { CommentDto, commentSchema } from '../dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('comment')
  async addComment(
    @Body(new ZodValidationPipe(commentSchema)) commentDto: CommentDto,
  ) {
    return commentDto;
  }
}
