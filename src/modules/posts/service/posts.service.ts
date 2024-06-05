import { Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { randomUUID } from 'crypto';

import { AppService } from 'src/common/services';

import { PostService } from 'src/modules/post/service';
import { CloudsService } from 'src/modules/clouds/service';
import { Post } from 'src/modules/post/model';

import { PostDto } from '../dto';

@Injectable()
export class PostsService extends AppService {
  constructor(
    private postService: PostService,
    private cloudsService: CloudsService,
  ) {
    super();
  }

  private uploadOption: UploadApiOptions = {
    resource_type: 'image',
    folder: 'chapter/posts',
    overwrite: false,
  };

  async addPost(postDto: PostDto, userId: string) {
    const { image, ...postData } = postDto;

    const post: Partial<Post> = { ...postData };

    if (image) {
      post.imageUrl = await this.uploadImage(image, userId);
    }
    return this.postService.createPost(post, userId);
  }

  async editPost(postDto: PostDto, postId: string, userId: string) {
    const { image, ...postData } = postDto;

    const post: Partial<Post> = { ...postData };

    if (image) {
      post.imageUrl = await this.uploadImage(image, userId);
    }
    return this.postService.editPost(post, { where: { id: postId } });
  }

  async deletePost(postId: string) {
    const post = await this.postService.findPostByPK(postId);
    if (post.imageUrl) {
      await this.deleteImage(post.imageUrl);
    }

    return post.destroy();
  }

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

  private async deleteImage(url: string) {
    return this.cloudsService.delete(url);
  }
}
