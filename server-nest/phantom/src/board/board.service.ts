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
    if (!board.coverImages) board.coverImages = [];
    if (board.coverImages && board.coverImages.length < 3) {
      board.coverImages.push(pin.imageId);
    }
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
      description: '',
      personalization: false,
      collaborators: [],
      isJoined: false,
      followers: [],
      counts: {
        followers: 0,
        joiners: 0,
        pins: 0,
      },
      coverImages: [],
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
    console.log(user.boards);
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
      createdOrjoined: 'created',
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
    let retBoards = [];
    for (var i = 0; i < user.boards.length; i++) {
      let board = await this.boardModel.findById(user.boards[i].boardId);
      if (board) {
        retBoards.push(board);
      }
    }
    return retBoards;
  }
  async getSomeUserBoards(userId, boardUserId) {
    if (
      (await this.ValidationService.checkMongooseID([userId, boardUserId])) == 0
    ) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    let boardUser = await this.UserService.getUserById(boardUserId);
    if (!boardUser) return false;
    let retBoards = [];
    for (var i = 0; i < boardUser.boards.length; i++) {
      let board = await this.boardModel.findById(boardUser.boards[i].boardId);
      if (!board) continue;
      if (board.status && board.status == 'public') {
        retBoards.push(board);
        continue;
      } else {
        if (await this.authorizedBoard(board, userId)) {
          retBoards.push(board);
          continue;
        }
      }
    }
    return retBoards;
  }
  async authorizedBoard(board, userId) {
    if (!board) return false;
    if (String(board.creator.id) == String(userId)) return true;
    if (!board.collaborators) {
      board.collaborators = [];
      await board.save();
    }
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

  async isCreator(board, userId) {
    if (!board) return false;
    if (String(board.creator.id) == String(userId)) return true;
    return false;
  }
  async isCollaborator(board, userId) {
    if (!board) return false;
    if (!board.collaborators) {
      board.collaborators = [];
      await board.save();
    }
    for (var i = 0; i < board.collaborators.length; i++) {
      if (String(board.collaborators[i] == userId)) {
        return board.collaborators[i];
      }
    }
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
    let creator = await this.UserService.getUserById(board.creator.id);
    if (!creator) {
      throw new BadRequestException('no board creator found');
    }
    if (!(await this.authorizedBoard(board, userId))) {
      throw new UnauthorizedException(
        'this user is unauthorized to edit this board',
      );
    }
    let isCreator = await this.isCreator(board, userId);
    let isCollaborator = await this.isCollaborator(board, userId);
    if (
      (isCreator || (isCollaborator && isCollaborator.editTitle)) &&
      editBoardDto.name
    ) {
      board.name = editBoardDto.name;

      for (var i = 0; i < creator.boards.length; i++) {
        if (String(boardId) == String(creator.boards[i].boardId)) {
          creator.boards[i].name = editBoardDto.name;
          await creator.save();
          break;
        }
      }
    }
    if (isCreator && editBoardDto.endDate) {
      board.endDate = new Date(editBoardDto.endDate);
    }
    if (isCreator && editBoardDto.startDate) {
      board.startDate = new Date(editBoardDto.startDate);
    }
    if (
      (isCreator || (isCollaborator && isCollaborator.editDescription)) &&
      editBoardDto.description
    ) {
      board.description = editBoardDto.description;
    }
    if (
      (isCreator || (isCollaborator && isCollaborator.personalization)) &&
      editBoardDto.personalization
    ) {
      board.personalization = editBoardDto.personalization;
    }
    if (
      editBoardDto.status &&
      (editBoardDto.status == 'public' || editBoardDto.status == 'private')
    ) {
      board.status = editBoardDto.status;
    }
    if (editBoardDto.topic) {
      board.topic = editBoardDto.topic;
    }
    if (
      (isCreator || (isCollaborator && isCollaborator.addCollaborators)) &&
      editBoardDto.collaboratores
    ) {
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
        let id = mongoose.Types.ObjectId(collaboratores[i]);
        board.collaborators.push({
          id: id,
          savePin: true,
          createPin: true,
          personalization: true,
          editTitle: false,
          editDescription: false,
          addCollaborators: false,
        });
        for (var i = 0; i < creator.boards.length; i++) {
          if (String(boardId) == String(creator.boards[i].boardId)) {
            creator.boards[i].joiners.push(id);
            await creator.save();
            break;
          }
        }
        let joiners = [];
        for (var i = 0; i < board.collaborators.length; i++) {
          joiners.push(board.collaborators[i].id);
        }
        collaborator.boards.push({
          boardId: boardId,
          name: board.name,
          createdAt: board.createdAt,
          isJoined: board.isJoined,
          createdOrjoined: 'joined',
          joiners: joiners,
          followers: board.followers,
        });
      }
    }
    await board.save();

    return board;
  }
  async getCollaboratoresPermissions(userId, boardId) {
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
    if (String(board.creator.id) != String(userId)) {
      throw new UnauthorizedException(
        'this user is unauthorized to get this board permissions',
      );
    }
    let retCollaborators = [];
    for (var i = 0; i < board.collaborators.length; i++) {
      let collaborator = await this.UserService.getUserById(
        board.collaborators[i].id,
      );
      retCollaborators.push({
        id: collaborator._id,
        imageId: collaborator.profileImage,
        name: collaborator.firstName + ' ' + collaborator.lastName,
        savePin: board.collaborators[i].savePin,
        createPin: board.collaborators[i].createPin,
        editTitle: board.collaborators[i].editTitle,
        personalization: board.collaborators[i].personalization,
        editDescription: board.collaborators[i].editDescription,
        addCollaborators: board.collaborators[i].addCollaborators,
      });
    }
    return retCollaborators;
  }
  async editCollaboratoresPermissions(
    userId,
    boardId,
    collaboratorId,
    savePin,
    createPin,
    addCollaborators,
    editTitle,
    personalization,
    editDescription,
  ) {
    if (
      (savePin != true && savePin != false) ||
      (createPin != true && createPin != false) ||
      (addCollaborators != true && addCollaborators != false) ||
      (editTitle != true && editTitle != false) ||
      (personalization != true && personalization != false) ||
      (editDescription != true && editDescription != false)
    ) {
      throw new BadRequestException('permissions must be boolean values');
    }
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
    if (String(board.creator.id) != String(userId)) {
      throw new UnauthorizedException(
        'this user is unauthorized to get this board permissions',
      );
    }
    for (var i = 0; i < board.collaborators.length; i++) {
      if (String(board.collaborators[i].id) == String(collaboratorId)) {
        board.collaborators[i].savePin = savePin;
        board.collaborators[i].createPin = createPin;
        board.collaborators[i].editTitle = editTitle;
        board.collaborators[i].addCollaborators = addCollaborators;
        board.collaborators[i].personalization = personalization;
        board.collaborators[i].editDescription = editDescription;

        await board.save();
      }
      return {
        id: board.collaborators[i].id,
        savePin: board.collaborators[i].savePin,
        createPin: board.collaborators[i].createPin,
        editTitle: board.collaborators[i].editTitle,
        addCollaborators: board.collaborators[i].addCollaborators,
        personalization: board.collaborators[i].personalization,
        editDescription: board.collaborators[i].editDescription,
      };
    }
    return false;
  }
}
