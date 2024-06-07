import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { LIMIT } from 'src/utils';
import { DataGuard } from 'src/common/guards';
import { UserData } from 'src/common/decorators';
import { ZodValidationPipe } from 'src/common/pipes';

import { CommentsService } from '../service';
import { CommentDto, commentSchema } from '../dto';

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
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateComment(
    @Body(new ZodValidationPipe(commentSchema))
    commentDto: CommentDto,
    @Param('commentId') commentId: string,
  ) {
    return await this.commentsService.updateComment(commentDto, commentId);
  }

  @UseGuards(DataGuard)
  @Delete('comment/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComment(@Param('commentId') commentId: string) {
    return await this.commentsService.deleteComment(commentId);
  }

  @Get(':postId')
  async getComments(
    @Param('postId') commentId: string,
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {}
}
