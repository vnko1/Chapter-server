import { Body, Controller, Param, Post } from '@nestjs/common';

import { UserData } from 'src/common/decorators';
import { ZodValidationPipe } from 'src/common/pipes';

import { CommentsService } from '../service';
import { CommentDto, commentSchema } from '../dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('comment/:postId/:parentId?')
  async addComment(
    @Body(new ZodValidationPipe(commentSchema))
    commentDto: CommentDto,
    @UserData('userId') userId: string,
    @Param('postId') postId: string,
    @Param('parentId') parentId?: string,
  ) {
    return await this.commentsService.addComment(
      commentDto,
      userId,
      postId,
      parentId,
    );
  }
}
