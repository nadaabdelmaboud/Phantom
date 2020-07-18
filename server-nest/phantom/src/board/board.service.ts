import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { board } from '../types/board';
import { UserService } from 'src/shared/user.service';
import { pin } from 'src/types/pin';
import { ValidationService } from 'src/shared/validation.service';
@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    private UserService: UserService,
    private ValidationService: ValidationService,
  ) {}
  async getBoardById(boardId): Promise<board> {
    try {
      if (!this.ValidationService.checkMongooseID([boardId]))
        throw new Error('not mongoose id');
      const board = await this.boardModel.findById(boardId);
      return board;
    } catch (ex) {
      throw new Error('not found');
    }
  }
  async addPintoBoard(pinId, boardId) {
    if ((await this.ValidationService.checkMongooseID([pinId, boardId])) == 0) {
      return false;
    }
    let board = await this.getBoardById(boardId);
    if (!board) return false;
    let pin = await this.pinModel.findById(pinId);
    if (!pin) return false;
    board.pins.push(pinId);
    board.counts.pins = board.counts.pins.valueOf() + 1;
    await board.save();
    return true;
  }
  async createBoard(name, userId) {
    let user = await this.UserService.getUserById(userId);
    if (!user) return 0;
    let board = new this.boardModel({
      name: name,
      pins: [],
      createdAt: Date.now(),
      counts: {
        followers: 0,
        joiners: 0,
        pins: 0,
      },
      creator: {
        firstName: user.firstName,
        lastName: user.lastName,
        id: userId,
      },
    });
    await board.save();
    await this.addBoardtoUser(userId, board._id);
    return board;
  }
  async addBoardtoUser(userId, boardId) {
    if (
      (await this.ValidationService.checkMongooseID([userId, boardId])) == 0
    ) {
      return false;
    }
    let board = await this.getBoardById(boardId);
    if (!board) return false;
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    user.boards.push({
      boardId: boardId,
      isJoined: false,
      joiners: [],
      followers: [],
    });
    await user.save();
    return true;
  }
  async getCurrentUserBoards(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    let allBoards = await this.boardModel.find({});
    console.log(allBoards);
    let retBoards = [];
    for (var i = 0; i < user.boards.length; i++) {
      for (var j = 0; j < allBoards.length; j++) {
        if (String(user.boards[i].boardId) == String(allBoards[j]._id)) {
          retBoards.push(allBoards[j]);
        }
      }
    }
    return retBoards;
  }
}
