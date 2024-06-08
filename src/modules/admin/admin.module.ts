import { Module } from '@nestjs/common';

import { UserModule, PostModule } from 'src/modules';

import { AdminService, AdminController } from '.';

@Module({
  imports: [UserModule, PostModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
