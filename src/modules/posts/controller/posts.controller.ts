import { Controller } from '@nestjs/common';
import { PostsService } from '../service';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}
}
