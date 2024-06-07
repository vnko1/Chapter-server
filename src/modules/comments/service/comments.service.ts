import { Injectable, NotFoundException } from '@nestjs/common';

import { AppService } from 'src/common/services';

import { CommentService } from 'src/modules/comment/service';
import { LikeService } from 'src/modules/like/service';
import { PostService } from 'src/modules/post/service';

import { CommentDto } from '../dto';

@Injectable()
export class CommentsService extends AppService {
  constructor(
    private commentService: CommentService,
    private likeService: LikeService,
    private postService: PostService,
  ) {
    super();
  }

  async addComment(
    commentDto: CommentDto,
    userId: string,
    postId: string,
    parentId?: string,
  ) {
    const post = await this.postService.findPostByPK(postId);
    if (!post) throw new NotFoundException('Post not found');

    if (parentId) {
      const parentComment = await this.commentService.findCommentByPK(parentId);
      if (!parentComment) throw new NotFoundException('Comment not found');
    }

    return await this.commentService.createComment({
      text: commentDto.text,
      userId,
      postId,
      parentId: parentId || null,
    });
  }

  async updateComment(commentDto: CommentDto, commentId: string) {
    return this.commentService.editComment(commentDto, {
      where: { commentId },
    });
  }

  async deleteComment(commentId: string) {
    return this.commentService.deleteComment({ where: { commentId } });
  }
}
