import { Module } from '@nestjs/common';
import { FeedController } from './controller';
import { FeedService } from './service';

@Module({ controllers: [FeedController], providers: [FeedService] })
export class FeedModule {}
