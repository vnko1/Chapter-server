import { Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { randomUUID } from 'crypto';

import { AppService } from 'src/common/services';

import { PostService } from 'src/modules/post/service';
import { CloudsService } from 'src/modules/clouds/service';
import { Post } from 'src/modules/post/model';

import { CreatePostDto } from '../dto';

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

  async addPost(createPostDto: CreatePostDto, id: string) {
    const { image, ...postData } = createPostDto;

    const post: Partial<Post> = { ...postData };

    if (image) {
      post.imageUrl = await this.uploadAvatar(image, id);
    }
    return this.postService.createPost(post, id);
  }

  private async uploadAvatar(image: Express.Multer.File, id: string) {
    const res = await this.cloudsService.upload(image.path, {
      ...this.uploadOption,
      public_id: id + '/' + randomUUID(),
    });

    return await this.cloudsService.edit(res.secure_url, {
      fetch_format: 'auto',
      quality: 'auto',
    });
  }
}
