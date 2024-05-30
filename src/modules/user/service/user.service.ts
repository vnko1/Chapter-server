import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { AppService } from 'src/common';
import { User } from '../model/user.model';

@Injectable()
export class UserService extends AppService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private sequelize: Sequelize,
  ) {
    super();
  }

  async getSom() {
    const transaction = await this.sequelize.transaction();
    this.userModel;
  }
}
