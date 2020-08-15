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
  limitOffset(limit, offset, specificAlbums): any[] {
    let start = 0;
    let end = specificAlbums.length;
    if (offset != undefined) {
      if (offset >= 0 && offset <= specificAlbums.length) {
        start = offset;


      }
    }
    if (limit != undefined) {
      if ((start + limit) > 0 && (start + limit) <= specificAlbums.length) {
        end = start + limit;

      }
    } else {
      limit = Number(process.env.LIMIT) ? Number(process.env.LIMIT) : 20;
      if ((start + limit) > 0 && (start + limit) <= specificAlbums.length) {
        end = start + limit;
      }
    }

    return specificAlbums.slice(start, end);
  }
}
