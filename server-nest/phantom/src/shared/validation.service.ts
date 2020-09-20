import { Injectable } from '@nestjs/common';
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
  limitOffset(limit: number, offset: number, specificAlbums: (string | object)[]): any[] {
    let start = 0;
    let end = specificAlbums.length;
    if (offset)
      if (offset >= 0 && offset <= specificAlbums.length)
        start = offset;
    let num = Number(start) + Number(limit)
    if (!limit)
      limit = Number(process.env.LIMIT) ? Number(process.env.LIMIT) : 20;

    if (num > 0 && num <= specificAlbums.length)
      end = Number(start) + Number(limit);
    return specificAlbums.slice(start, end);
  }
}
