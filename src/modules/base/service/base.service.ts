import { Injectable } from '@nestjs/common';
import { AppService } from 'src/common';

@Injectable()
export class BaseService extends AppService {
  constructor() {
    super();
  }
  getHello(): string {
    return 'Hello World!';
  }
}
