import { Module } from '@nestjs/common';

import { CloudsService, CloudsProvider } from '.';

@Module({
  providers: [CloudsProvider, CloudsService],
  exports: [CloudsProvider, CloudsService],
})
export class CloudsModule {}
