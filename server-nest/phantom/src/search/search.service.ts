import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { board } from '../types/board';
import { user } from '../types/user';
import { ValidationService } from 'src/shared/validation.service';
import { promises, NOTFOUND } from 'dns';
import { pin } from 'src/types/pin';
import { async } from 'rxjs';
import e from 'express';
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

    return await this.ValidationService.limitOffset(limit, offset, result);
  }
  async getAllPins(name, limit, offset) {
    let pin = await this.pinModel.find({}, (err, pin) => {
      if (err) return 0;
      return pin;
    });
    let pins = await this.Fuzzy(pin, ['title', 'note'], name, limit, offset);
    return pins;
  }
  async getMyPins(name, userId, limit, offset) {
    if (!(await this.ValidationService.checkMongooseID([userId])))
      throw new Error('not mongoose id');
    let pin = await this.pinModel.find({});

    let pins = await this.Fuzzy(pin, ['title', 'note'], name, limit, offset);
    let myPins = [];
    for (let i = 0; i < pins.length; i++) {
      if (String(pins[i].creator.id) == String(userId)) myPins.push(pins[i]);
    }
    return myPins;
  }

  async getPeople(name, limit, offset) {
    // should delete
    let user = await this.userModel.find({}, (err, user) => {
      if (err) return 0;
      return user;
    });
    for (let i = 0; i < user.length; i++) {
      user[i].activateaccount = true;
      await user[i].save();
    }
    ///
    user = await this.userModel.find({ activateaccount: true }, (err, user) => {
      if (err) return 0;
      return user;
    });
    let users = await this.Fuzzy(
      user,
      ['firstName', 'lastName'],
      name,
      limit,
      offset,
    );

    return users;
  }
  async getBoards(name, limit, offset) {
    let board = await this.boardModel.find({}, (err, board) => {
      if (err) return 0;
      return board;
    });
    let boards = await this.Fuzzy(
      board,
      ['name', 'description', 'topic'],
      name,
      limit,
      offset,
    );
    return boards;
  }
}
