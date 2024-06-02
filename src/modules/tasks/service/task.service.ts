import { Injectable } from '@nestjs/common';
import { AppService } from 'src/common/services';
import { UserService } from 'src/modules/user/service';

@Injectable()
export class TaskService extends AppService {
  constructor(private userService: UserService) {
    super();
  }
}
