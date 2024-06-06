import { Injectable } from '@nestjs/common';
import { AppService } from 'src/common/services';

@Injectable()
export class CommentService extends AppService {
  constructor() {
    super();
  }
}
