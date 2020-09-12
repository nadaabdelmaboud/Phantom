import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { board } from '../types/board';
import { user } from '../types/user';
import { ValidationService } from 'src/shared/validation.service';
import { pin } from 'src/types/pin';
import * as search from 'fuzzy-search';
@Injectable()
export class SearchService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('User') private readonly userModel: Model<user>,
    private ValidationService: ValidationService,
  ) { }
  async Fuzzy(model, params, name, limit, offset) {
    const searcher = new search(model, params, {
      caseSensitive: false,
      sort: true,
    });
    let result = searcher.search(name);
    return this.ValidationService.limitOffset(limit, offset, result);
  }
  async getAllPins(name, limit, offset) {
    let pin = await this.pinModel.find({}, 'title note imageId').lean();
    return await this.Fuzzy(pin, ['title', 'note'], name, limit, offset);
  }
  async getMyPins(name, userId, limit, offset) {
    if (!(await this.ValidationService.checkMongooseID([userId])))
      throw new Error('not mongoose id');
    let pin = await this.pinModel.find({ 'creator.id': Types.ObjectId(userId) }, 'title note imageId').lean();
    return await this.Fuzzy(pin, ['title', 'note'], name, limit, offset);

  }
  async addToRecentSearch(userId, name) {
    if (!await this.userModel.findOne({ recentSearch: name, _id: userId }, '_id').lean())
      return await this.userModel.findByIdAndUpdate(userId, { $push: { recentSearch: name } }).lean();
    return 0;
  }
  async getPeople(name, limit, offset) {

    let user = await this.userModel.aggregate([{ $match: {} }, { $project: { boards: { $size: '$boards' }, followers: { $size: '$followers' }, profileImage: 1, userName: 1, lastName: 1, firstName: 1 } }])
    return await this.Fuzzy(
      user,
      ['firstName', 'lastName', 'userName'],
      name,
      limit,
      offset,
    );

  }
  async getRecentSearch(userId) {
    return await this.userModel.findById(userId, 'recentSearch').lean()
  }
  async getBoards(name, limit, offset) {
    let board = await this.boardModel.aggregate([{ $match: {} }, { $project: { pins: { $size: '$pins' }, sections: { $size: '$sections' }, coverImages: 1, topic: 1, description: 1, name: 1 } }])
    return await this.Fuzzy(
      board,
      ['name', 'description', 'topic'],
      name,
      limit,
      offset,
    );

  }
}
