import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptions, Op } from 'sequelize';
import { UploadApiOptions } from 'cloudinary';
import { randomUUID } from 'crypto';

import { AppService } from 'src/common/services';

import { Like, LikeService } from 'src/modules/like';
import { Post, PostService } from 'src/modules/post';
import { Comment } from 'src/modules/comment';
import { User } from 'src/modules/user';
import { CloudsService } from 'src/modules/clouds';

import { PostDto } from '../dto';

@Injectable()
export class PostsService extends AppService {
  constructor(
    private postService: PostService,
    private cloudsService: CloudsService,
    private likeService: LikeService,
  ) {
    super();
  }
  private likeQueryOpt: FindOptions = {
    include: [{ model: Like, as: 'likes', attributes: ['userId'] }],
  };
  private commentsQueryOpt = {
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
  };
  private postsQueryOpt: FindOptions = {
    include: [
      {
        model: Comment,
        where: { parentId: { [Op.is]: null } },
        required: false,
        order: [['createdAt', 'ASC']],
        include: [
          {
            model: Like,
            as: 'commentLikes',
            attributes: ['userId'],
          },
          {
            model: Comment,
            as: 'replies',
            order: [['createdAt', 'ASC']],
            required: false,
            include: [
              {
                model: Like,
                as: 'replyLikes',
                attributes: ['userId'],
              },
            ],
          },
        ],
      },
    ],
  };

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
    return await this.postService.findPostByPK(postId, {
      order: [['createdAt', 'ASC']],
      include: [this.postsQueryOpt.include[0], this.likeQueryOpt.include[0]],
    });
  }

  async getPostsByUserId(userId: string, offset: number, limit: number) {
    const { count, rows } = await this.postService.findAndCountPosts({
      where: { userId },
      offset,
      limit,
      order: [['createdAt', 'ASC']],
      include: [this.likeQueryOpt.include[0], this.postsQueryOpt.include[0]],
    });

    return { count, posts: rows };
  }

  async postLikeToggler(postId: string, userId: string) {
    const post = await this.postService.findPostByPK(postId);
    if (!post) throw new NotFoundException('Post not found');

    const like = await this.likeService.findLike({ where: { postId, userId } });

    if (like) await like.destroy();
    else await this.likeService.addLike({ postId, userId, commentId: null });

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
      include: [...this.commentsQueryOpt.include],
    });
    return likes.map((like) => like.liker);
  }

  async getPostsLikedByUser(userId: string, offset: number, limit: number) {
    const { count, rows } = await this.postService.findAndCountPosts({
      offset,
      limit,
      attributes: {
        exclude: ['likeId'],
      },
      include: [
        { model: Like, as: 'likes', attributes: ['userId'], where: { userId } },
        this.postsQueryOpt.include[0],
      ],
    });
    return { count, posts: rows };
  }
}
