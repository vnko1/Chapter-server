import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { UserData } from 'src/common/decorators';
import { ZodValidationPipe } from 'src/common/pipes';

import { CommentsService } from '../service';
import { CommentDto, commentSchema } from '../dto';
import { DataGuard } from 'src/common/guards';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('comment/:postId/:parentId?')
  @HttpCode(HttpStatus.NO_CONTENT)
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

  @UseGuards(DataGuard)
  @Patch('comment/:commentId')
  // @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Body(new ZodValidationPipe(commentSchema))
    commentDto: CommentDto,
    @UserData('userId') userId: string,
    @Param('commentId') commentId: string,
  ) {
    return commentId;
  }
}
