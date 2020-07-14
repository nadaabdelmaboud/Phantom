import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user } from '../types/user';
const ObjectId = require('mongoose').Types.ObjectId;
@Injectable()
export class ValidationService {
  constructor() {}

  async checkMongooseID(ids) {
    for (let id of ids) {
      if (id == undefined) continue;
      if (!ObjectId.isValid(id)) return 0;
    }
    return 1;
  }
}
