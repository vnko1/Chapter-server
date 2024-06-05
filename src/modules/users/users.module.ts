import { Module } from '@nestjs/common';

import { CloudsModule } from '../clouds/clouds.module';
import { UserModule } from '../user/user.module';

import { UsersService } from './service';
import { UsersController } from './controller';

@Module({
  imports: [CloudsModule, UserModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
