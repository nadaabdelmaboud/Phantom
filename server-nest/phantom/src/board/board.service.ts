import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model, Mongoose } from 'mongoose';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { board } from '../types/board';
import { UserService } from 'src/shared/user.service';
import { pin } from 'src/types/pin';
import { ValidationService } from 'src/shared/validation.service';
import { editBoardDto } from './dto/editBoard.dto';
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
  async createBoard(
    name: string,
    startDate: Date,
    endDate: Date,
    status: string,
    userId: string,
  ) {
    let user = await this.UserService.getUserById(userId);
    if (!user) return 0;
    let board = new this.boardModel({
      name: name,
      pins: [],
      startDate: startDate,
      endDate: endDate,
      status: status,
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
    await board.save().catch(err => {
      console.log(err);
    });
    await this.addBoardtoUser(userId, board._id);
    return board;
  }
  async sortBoardsAtoZ(userId): Promise<Array<object>> {
    let user = await this.UserService.getUserById(userId);

    await user.boards.sort((a, b) => a.name.localeCompare(b.name.toString()));
    await user.save();
    return user.boards;
  }

  async sortBoardsDate(userId): Promise<Array<object>> {
    let user = await this.UserService.getUserById(userId);

    await user.boards.sort(function(a, b) {
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      return 0;
    });
    await user.save();
    return user.boards;
  }
  //start index  0 based index of the element in the array
  //positionIndex  the postion the element would be in from (>= 1 to the <= array.size())
  async reorderBoards(
    userId,
    startIndex,
    positionIndex,
  ): Promise<Array<object>> {
    let user = await this.UserService.getUserById(userId);
    if (
      startIndex < 0 ||
      startIndex >= user.boards.length ||
      positionIndex < 1 ||
      positionIndex > user.boards.length
    ) {
      throw new BadRequestException({
        message: 'startIndex or positionIndex are not valid',
      });
    }
    let desiredBorder = await user.boards.splice(startIndex, 1);
    await user.boards.splice(positionIndex - 1, 0, desiredBorder[0]);
    await user.save();
    return user.boards;
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
      name: board.name,
      createdAt: board.createdAt,
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

  async authorizedBoard(board, userId) {
    if (!board) return false;
    if (String(board.creator.id) == String(userId)) return true;
    for (var i = 0; i < board.collaborators.length; i++) {
      if (String(board.collaborators[i] == userId)) {
        return true;
      }
    }
    return false;
  }
  async isPublicBoard(boardId) {
    let board = await this.boardModel.findById(boardId);
    if (!board) return false;
    if (board.status == 'public') return true;
    return false;
  }
  async editBoard(boardId, userId, editBoardDto: editBoardDto) {
    if (
      (await this.ValidationService.checkMongooseID([boardId, userId])) == 0
    ) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    let board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new BadRequestException('not valid board');
    }
    if (!(await this.authorizedBoard(board, userId))) {
      throw new UnauthorizedException(
        'this user is unauthorized to edit this board',
      );
    }
    if (editBoardDto.name) {
      board.name = editBoardDto.name;
    }
    if (editBoardDto.endDate) {
      board.endDate = new Date(editBoardDto.endDate);
    }
    if (editBoardDto.startDate) {
      board.startDate = new Date(editBoardDto.startDate);
    }
    if (editBoardDto.description) {
      board.description = editBoardDto.description;
    }
    if (editBoardDto.personalization) {
      board.personalization = editBoardDto.personalization;
    }
    if (editBoardDto.status) {
      board.status = editBoardDto.status;
    }
    if (editBoardDto.topic) {
      board.topic = editBoardDto.topic;
    }
    if (editBoardDto.collaboratores) {
      let collaboratores = editBoardDto.collaboratores.split(',');
      for (var i = 0; i < collaboratores.length; i++) {
        if (
          (await this.ValidationService.checkMongooseID([collaboratores[i]])) ==
          0
        ) {
          continue;
        }
        let collaborator = await this.UserService.getUserById(
          collaboratores[i],
        );
        if (!collaborator) continue;
        if (!board.collaborators) board.collaborators = [];
        let id = new mongoose.SchemaTypes.ObjectId(collaboratores[i]);
        board.collaborators.push(id);
      }
    }
    //if user is allowed whether this is his board or he is a collaboarotor
    await board.save();
    return board;
  }
}
