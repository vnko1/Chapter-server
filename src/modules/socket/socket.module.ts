import { Module } from '@nestjs/common';
import { SocketGateway } from './gateway';
import { SocketService } from './services';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway],
})
export class SocketModule {}
