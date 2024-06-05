import { Module } from '@nestjs/common';

import { CloudsService } from './service';
import { CloudsProvider } from './provider';

@Module({
  providers: [CloudsProvider, CloudsService],
  exports: [CloudsProvider, CloudsService],
})
export class CloudsModule {}
