import { Injectable } from '@nestjs/common';

import { AppService } from 'src/common/services';
import { PostService } from 'src/modules/post/service';
import { CreatePostDto } from '../dto';
import { CloudsService } from 'src/modules/clouds/service';
import { UploadApiOptions } from 'cloudinary';

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
    folder: 'chapter/avatar',
    overwrite: true,
  };

  async addPost(createPostDto: CreatePostDto, id: string) {
    const { image, ...postData } = createPostDto;

    const post: CreatePostDto = { ...postData };

    //   if(image)
  }
}
