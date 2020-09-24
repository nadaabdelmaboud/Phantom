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
  limitOffset(
    limit: number,
    offset: number,
    specificElements: (string | object)[],
  ): any[] {
    let start = 0;
    let end = specificElements.length;
    if (offset)
      if (offset >= 0 && offset <= specificElements.length) start = offset;
    let num = Number(start) + Number(limit);
    if (!limit)
      limit = Number(process.env.LIMIT) ? Number(process.env.LIMIT) : 20;

    if (num > 0 && num <= specificElements.length)
      end = Number(start) + Number(limit);
    return specificElements.slice(start, end);
  }
}
