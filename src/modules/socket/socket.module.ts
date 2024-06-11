import { Module } from '@nestjs/common';
import { SocketGateway } from './gateway';
import { SocketService } from './services';

@Module({
  providers: [SocketGateway, SocketService],
  exports: [SocketGateway],
})
export class SocketModule {}
