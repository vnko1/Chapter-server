import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';

import { AdminService } from './service';
import { AdminController } from './controller';

@Module({
  imports: [UserModule, PostModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
