import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user } from '../types/user';
const ObjectId = require('mongoose').Types.ObjectId;
@Injectable()
export class ValidationService {
  constructor() { }

  async checkMongooseID(ids) {
    for (let id of ids) {
      if (id == undefined) continue;
      if (!ObjectId.isValid(id)) return 0;
    }
    return 1;
  }
  limitOffset(
    limit: number,
    offset: number,
    specificElements: (string | object)[],
  ): any[] {
    if (offset >= specificElements.length) throw new NotFoundException();
    let end = Number(limit) + Number(offset);
    if (end > specificElements.length)
      end = specificElements.length
    return specificElements.slice(offset, end);
  }
}
