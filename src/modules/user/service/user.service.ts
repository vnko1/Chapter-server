import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppService, UserEmailDto } from 'src/common';
import { User } from '../model/user.model';

@Injectable()
export class UserService extends AppService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super();
  }

  async registerEmail(userEmailDto: UserEmailDto) {
    const newUser = await this.userModel.create(userEmailDto);
    return newUser;
  }
}
