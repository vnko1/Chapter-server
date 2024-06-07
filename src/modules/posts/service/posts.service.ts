import { Injectable, NotFoundException } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { randomUUID } from 'crypto';

import { AppService } from 'src/common/services';

import { LikeService } from 'src/modules/like/service';
import { PostService } from 'src/modules/post/service';
import { CommentService } from 'src/modules/comment/service';
import { CloudsService } from 'src/modules/clouds/service';
import { Post } from 'src/modules/post/model';
import { User } from 'src/modules/user/model';

import { PostDto } from '../dto';

@Injectable()
export class PostsService extends AppService {
  constructor(
    private postService: PostService,
    private cloudsService: CloudsService,
    private likeService: LikeService,
    private commentService: CommentService,
  ) {
    super();
  }

  private uploadOption: UploadApiOptions = {
    resource_type: 'image',
    folder: 'chapter/posts',
    overwrite: false,
  };

  private async uploadImage(image: Express.Multer.File, userId: string) {
    const res = await this.cloudsService.upload(image.path, {
      ...this.uploadOption,
      public_id: userId + '/' + randomUUID(),
    });

    return await this.cloudsService.edit(res.secure_url, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }

  async addPost(postDto: PostDto, userId: string) {
    const { image, ...postData } = postDto;

    const post: Partial<Post> = { ...postData };

    if (image) post.imageUrl = await this.uploadImage(image, userId);
    return this.postService.createPost(post, userId);
  }

  async editPost(
    { image, text, title }: PostDto,
    postId: string,
    userId: string,
  ) {
    const post = await this.postService.findPostByPK(postId);
    if (image) {
      await this.cloudsService.delete(post.imageUrl);
      post.imageUrl = await this.uploadImage(image, userId);
    }
    if (title) post.title = title;
    if (text) post.text = text;
    return post.save();
  }

  async deletePost(postId: string) {
    const post = await this.postService.findPostByPK(postId);
    if (post.imageUrl) await this.cloudsService.delete(post.imageUrl);

    return post.destroy();
  }

  async getPostById(postId: string) {
    return await this.postService.findPostByPK(
      postId,
      this.commentService.queryOpt,
    );
  }

  async getPostsByUserId(userId: string, offset: number, limit: number) {
    const { count, rows } = await this.postService.findAndCountPosts({
      where: { userId },
      offset,
      limit,
      ...this.commentService.queryOpt,
    });
    return { count, posts: rows };
  }

  async likeToggler(postId: string, userId: string) {
    const post = await this.postService.findPostByPK(postId);
    if (!post) throw new NotFoundException('Post not found');

    const like = await this.likeService.findLike({ where: { postId, userId } });

    if (like) await like.destroy();
    else await this.likeService.addLike(postId, userId);

    const likes = await this.likeService.findLikes({
      where: { postId },
      attributes: ['userId'],
    });
    return likes.map((like) => like.userId);
  }

  async getUsersLikedPost(postId: string) {
    const post = await this.postService.findPostByPK(postId);
    if (!post) throw new NotFoundException('Post not found');

    const likes = await this.likeService.findLikes({
      where: { postId },
      include: [
        {
          model: User,
          as: 'liker',
          attributes: [
            'userId',
            'email',
            'firstName',
            'lastName',
            'nickName',
            'status',
            'location',
            'avatarUrl',
          ],
        },
      ],
    });
    return likes.map((like) => like.liker);
  }

  async getPostsLikedByUser(userId: string, offset: number, limit: number) {
    const { count, rows } = await this.likeService.findAndCountLikes({
      where: { userId },
      offset,
      limit,
      attributes: {
        exclude: ['likeId', 'postId', 'userId', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Post,
          include: [this.commentService.queryOpt.include[0]],
        },
      ],
    });
    return { count, posts: rows.map((row) => row.likedPost) };
  }
}
