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
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { LIMIT, multerConfig } from 'src/utils';
import { DataGuard } from 'src/common/guards';
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
    @UserData('userId') userId: string,
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

  @UseGuards(DataGuard)
  @Patch('post/:postId')
  @UseInterceptors(
    FileInterceptor('image', { storage: diskStorage(multerConfig) }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @UserData('userId') userId: string,
    @Param('postId') postId: string,
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

  @UseGuards(DataGuard)
  @Delete('post/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('postId') postId: string) {
    return await this.postsService.deletePost(postId);
  }

  @Get('post/:postId')
  async getPostById(@Param('postId') postId: string) {
    return await this.postsService.getPostById(postId);
  }

  @Get('own')
  async getOwnPosts(
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @UserData('userId') userId: string,
  ) {
    return await this.postsService.getPostsByUserId(userId, offset, limit);
  }

  @Get('user/:userId')
  async getUserPosts(
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Param('userId') userId: string,
  ) {
    return await this.postsService.getPostsByUserId(userId, offset, limit);
  }

  @Put('post/:postId/like')
  async addPost(
    @Param('postId') postId: string,
    @UserData('userId') userId: string,
  ) {
    return await this.postsService.likeToggler(postId, userId);
  }

  @Get('post/:postId/likers')
  async getLikedUsers(@Param('postId') postId: string) {
    return await this.postsService.getUsersLikedPost(postId);
  }

  @Get('own/likes')
  async getOwnLikedPosts(
    @UserData('userId') userId: string,
    @Query('limit', new DefaultValuePipe(LIMIT), ParseIntPipe) limit: number,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
  ) {
    return await this.postsService.getPostsLikedByUser(userId, offset, limit);
  }
}
