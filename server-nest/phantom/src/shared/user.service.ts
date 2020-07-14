import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user } from '../types/user';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<user>) {}
  async getUserById(id) {
    return await this.userModel.findById(id);
  }
}
