import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BaseModule } from './modules';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), BaseModule],
})
export class AppModule {}
