import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { pin } from '../types/pin';
import { UserService } from 'src/shared/user.service';
@Injectable()
export class PinsService {
  constructor(
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    private UserService: UserService,
  ) {}
  async getPins() {
    return await this.pinModel.find();
  }
}
