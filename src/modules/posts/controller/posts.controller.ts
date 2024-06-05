import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { multerConfig } from 'src/utils';
import { UserData } from 'src/common/decorators';

import { PostsService } from '../service';
import { PostDto, postSchema } from '../dto';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('post')
  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async createPost(
    @UserData('id') id: string,
    @Body() createPostDto: PostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsedSchema = postSchema.safeParse({
      ...createPostDto,
      image,
    });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.postsService.addPost(parsedSchema.data, id);
  }

  @Patch('post')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost() {}
}
