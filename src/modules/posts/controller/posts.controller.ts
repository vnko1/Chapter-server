import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { LIMIT, multerConfig } from 'src/utils';
import { UserData } from 'src/common/decorators';

import { PostsService } from '../service';
import { PostDto, postSchema } from '../dto';
import { PostGuard } from '../guards';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('post')
  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async createPost(
    @UserData('id') userId: string,
    @Body() createPostDto: PostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsedSchema = postSchema.safeParse({
      ...createPostDto,
      image,
    });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.postsService.addPost(parsedSchema.data, userId);
  }

  @UseGuards(PostGuard)
  @Patch('post/:id')
  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @UserData('id') userId: string,
    @Param('id') postId: string,
    @Body() createPostDto: PostDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const parsedSchema = postSchema.safeParse({
      ...createPostDto,
      image,
    });

    if (!parsedSchema.success)
      throw new BadRequestException(parsedSchema.error.errors[0].message);

    return await this.postsService.editPost(parsedSchema.data, postId, userId);
  }

  @UseGuards(PostGuard)
  @Delete('post/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') postId: string) {
    return await this.postsService.deletePost(postId);
  }

  @Get('post/:id')
  async getPostById(@Param('id') postId: string) {
    return await this.postsService.getPostById(postId);
  }

  @Get('own')
  async getOwnPosts(
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @UserData('id') userId: string,
  ) {
    return await this.postsService.getPostsById(userId, offset, limit);
  }

  @Get('user/:id')
  async getUserPosts(
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Param('id') userId: string,
  ) {
    return await this.postsService.getPostsById(userId, offset, limit);
  }
}
