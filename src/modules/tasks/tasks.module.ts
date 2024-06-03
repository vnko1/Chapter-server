import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TaskService } from './service';

@Module({ imports: [UserModule], providers: [TaskService] })
export class TasksModule {}
