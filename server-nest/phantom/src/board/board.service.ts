import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { Model, Mongoose } from 'mongoose';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { board } from '../types/board';
import { UserService } from 'src/shared/user.service';
import { pin } from 'src/types/pin';
import { ValidationService } from 'src/shared/validation.service';
import { section } from '../types/board';
import { topic } from 'src/types/topic';
import { EditBoardDto } from './dto/edit-board.dto';
import { EditCollaboratoresPermissionsDto } from './dto/edit-collaboratores-permissions.dto';
@Injectable()
export class BoardService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
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
  async addPintoBoard(pinId, boardId, sectionId) {
    if ((await this.ValidationService.checkMongooseID([pinId, boardId])) == 0) {
      return false;
    }
    if (sectionId) {
      if ((await this.ValidationService.checkMongooseID([sectionId])) == 0) {
        throw new BadRequestException('not valid section id');
      }
    } else {
      sectionId = null;
    }
    let board = await this.getBoardById(boardId);
    if (!board) return false;
    let pin = await this.pinModel.findById(pinId);
    if (!pin) return false;

    let pinObjectId = mongoose.Types.ObjectId(pinId);
    if (sectionId) {
      for (let i = 0; i < board.sections.length; i++) {
        if (String(board.sections[i]._id) == String(sectionId)) {
          board.sections[i].pins.push(pinObjectId);
          if (!board.sections[i].coverImages)
            board.sections[i].coverImages = [];
          if (
            board.sections[i].coverImages &&
            board.sections[i].coverImages.length < 3
          ) {
            board.sections[i].coverImages.push(pin.imageId);
          }
          break;
        }
      }
    } else {
      board.pins.push(pinObjectId);
      board.counts.pins = board.counts.pins.valueOf() + 1;
      if (!board.coverImages) board.coverImages = [];
      if (board.coverImages && board.coverImages.length < 3) {
        board.coverImages.push(pin.imageId);
      }
    }

    await board.save().catch(err => {
      console.log(err);
    });
    console.log('pin saved');
    return true;
  }
  async createBoard(
    name: string,
    startDate: string,
    endDate: string,
    status: string,
    userId: string,
  ) {

    let user = await this.UserService.getUserById(userId);
    if (!user) return 0;
    let sd = startDate ? startDate : null;
    let ed = endDate ? endDate : null;
  
    let board = new this.boardModel({
      name: name,
      pins: [],
      status: status,
      startDate: sd,
      endDate: ed,
      createdAt: Date.now(),
      description: '',
      personalization: false,
      collaborators: [],
      sections: [],
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
    console.log('saved');
    await this.addBoardtoUser(userId, board._id);
    console.log('saved 2');
    return board;
  }
  async sortBoardsAtoZ(userId): Promise<Array<object>> {
    let user = await this.UserService.getUserById(userId);

    await user.boards.sort((a, b) => a.name.localeCompare(b.name.toString()));
    user.sortType = 'A-Z';
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
    user.sortType = 'Date';
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
    user.sortType = 'Reorder';
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
    let id = mongoose.Types.ObjectId(boardId);
    user.boards.push({
      boardId: id,
      name: board.name,
      createdAt: board.createdAt,
      isJoined: false,
      createdOrjoined: 'created',
    });
    await user.save().catch(err => {
      console.log(err);
    });
    return true;
  }
  async getCurrentUserBoards(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    let retBoards = [];
    let permissions = {};
    for (let i = 0; i < user.boards.length; i++) {
      let board = await this.boardModel.findById(user.boards[i].boardId);
      let createdOrjoined = 'created';
      if (user.boards[i].createdOrjoined == 'joined') {
        createdOrjoined = 'joined';
        for (let j = 0; j < board.collaborators.length; j++) {
          if (String(board.collaborators[j].collaboratorId) == String(userId)) {
            permissions = {
              savePin: board.collaborators[j].savePin,
              createPin: board.collaborators[j].createPin,
              addCollaborators: board.collaborators[j].addCollaborators,
              editDescription: board.collaborators[j].editDescription,
              editTitle: board.collaborators[j].editTitle,
              personalization: board.collaborators[j].personalization,
            };
            break;
          }
        }
      }
      if (board) {
        console.log(board);
        retBoards.push({
          board: board,
          createdOrjoined: createdOrjoined,
          permissions: permissions,
        });
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
      let collaborator = await this.isCollaborator(board, userId);
      if ((board.status && board.status == 'public') || collaborator) {
        let isJoined = false;
        let permissions = {};
        if (collaborator) {
          isJoined = true;
          permissions = {
            savePin: collaborator.savePin,
            createPin: collaborator.createPin,
            addCollaborators: collaborator.addCollaborators,
            editDescription: collaborator.editDescription,
            editTitle: collaborator.editTitle,
            personalization: collaborator.personalization,
          };
        }
        retBoards.push({
          board: board,
          isJoined: isJoined,
          permissions: permissions,
        });
        continue;
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
      if (String(board.collaborators[i]) == String(userId)) {
        return board.collaborators[i];
      }
    }
    return false;
  }
  async editBoard(boardId, userId, editBoardDto: EditBoardDto) {
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
      board.endDate = editBoardDto.endDate;
    }
    if (isCreator && editBoardDto.startDate) {
      board.startDate = editBoardDto.startDate;
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
      console.log(editBoardDto.collaboratores);
      let collaboratores = await editBoardDto.collaboratores.split(',');
      console.log(collaboratores);
      for (var i = 0; i < collaboratores.length; i++) {
        console.log(collaboratores.length);
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
          collaboratorId: id,
          savePin: true,
          createPin: true,
          personalization: true,
          editTitle: false,
          editDescription: false,
          addCollaborators: false,
        });

        collaborator.boards.push({
          boardId: boardId,
          name: board.name,
          createdAt: board.createdAt,
          isJoined: board.isJoined,
          createdOrjoined: 'joined',
        });
        await collaborator.save();
        console.log(collaborator);
        await board.save();
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
        board.collaborators[i].collaboratorId,
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
    editCollaboratoresPermissionsDto: EditCollaboratoresPermissionsDto,
  ) {
    console.log(editCollaboratoresPermissionsDto);
    let collaboratorId = editCollaboratoresPermissionsDto.collaboratorId,
      savePin = editCollaboratoresPermissionsDto.savePin,
      createPin = editCollaboratoresPermissionsDto.createPin,
      addCollaborators = editCollaboratoresPermissionsDto.addCollaborators,
      editTitle = editCollaboratoresPermissionsDto.editTitle,
      personalization = editCollaboratoresPermissionsDto.personalization,
      editDescription = editCollaboratoresPermissionsDto.editDescription;
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
      (await this.ValidationService.checkMongooseID([
        boardId,
        userId,
        collaboratorId,
      ])) == 0
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
      if (
        String(board.collaborators[i].collaboratorId) == String(collaboratorId)
      ) {
        board.collaborators[i].savePin = savePin;
        board.collaborators[i].createPin = createPin;
        board.collaborators[i].editTitle = editTitle;
        board.collaborators[i].addCollaborators = addCollaborators;
        board.collaborators[i].personalization = personalization;
        board.collaborators[i].editDescription = editDescription;

        await board.save();
        return {
          id: board.collaborators[i].collaboratorId,
          savePin: board.collaborators[i].savePin,
          createPin: board.collaborators[i].createPin,
          editTitle: board.collaborators[i].editTitle,
          addCollaborators: board.collaborators[i].addCollaborators,
          personalization: board.collaborators[i].personalization,
          editDescription: board.collaborators[i].editDescription,
        };
      }
    }
    return false;
  }

  async deleteCollaborator(userId, boardId, collaboratorId) {
    if (
      (await this.ValidationService.checkMongooseID([
        boardId,
        userId,
        collaboratorId,
      ])) == 0
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
    let collaborator = null;
    if (board.collaborators.length == 0) {
      throw new NotFoundException('this board has no collaboratores');
    }
    console.log(collaboratorId);
    console.log(board.collaborators);
    for (let i = 0; i < board.collaborators.length; i++) {
      if (
        String(board.collaborators[i].collaboratorId) == String(collaboratorId)
      ) {
        collaborator = await this.UserService.getUserById(
          board.collaborators[i].collaboratorId,
        );
        board.collaborators.splice(i, 1);
        await board.save();
        break;
      }
    }
    console.log(collaborator.boards);
    if (collaborator) {
      console.log(boardId);
      for (let index = 0; index < collaborator.boards.length; index++) {
        console.log(collaborator.boards[index]);
        if (
          String(collaborator.boards[index].boardId) == String(boardId) &&
          collaborator.boards[index].createdOrjoined == 'joined'
        ) {
          console.log('sss');
          collaborator.boards.splice(index, 1);
          await collaborator.save();
          return true;
        }
      }
    } else {
      throw new NotAcceptableException('collaborator not found');
    }
  }
  async deletePin(pinId, userId) {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    let pin = await this.pinModel.findById(pinId);
    if (!pin) {
      throw new BadRequestException('not valid board');
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    if (String(pin.creator.id) != String(userId)) {
      throw new UnauthorizedException(
        'this user is unauthorized to delete this pin',
      );
    }
    let creator = await this.UserService.getUserById(pin.creator.id);
    if (!creator) {
      throw new NotAcceptableException('not valid pin creator');
    }
    for (let i = 0; i < creator.pins.length; i++) {
      if (String(creator.pins[i].pinId) == String(pinId)) {
        let pinBoard = await this.boardModel.findById(creator.pins[i].boardId);
        let pinSection = pin.section;
        if (pinSection) {
          for (let j = 0; j < pinBoard.sections.length; j++) {
            if (String(pinBoard.sections[j]._id) == String(pinSection)) {
              for (let k = 0; k < pinBoard.sections[j].pins.length; k++) {
                if (String(pinBoard.sections[j].pins[k]) == String(pinId)) {
                  pinBoard.sections[j].pins.splice(k, 1);
                  await pinBoard.save();
                  break;
                }
              }
            }
          }
        } else {
          for (let j = 0; j < pinBoard.pins.length; j++) {
            if (String(pinBoard.pins[j]) == String(pinId)) {
              pinBoard.pins.splice(j, 1);
              await pinBoard.save();
              break;
            }
          }
        }

        creator.pins.splice(i, 1);
        await creator.save();
        break;
      }
    }
    let savers = [];
    for (let i = 0; i < pin.savers.length; i++) {
      let saverUser = await this.UserService.getUserById(pin.savers[i]);
      if (saverUser) {
        savers.push(saverUser);
      }
    }

    for (let k = 0; k < savers.length; k++) {
      for (let i = 0; i < savers[k].savedPins.length; i++) {
        if (String(savers[k].savedPins[i].id) == String(pinId)) {
          let pinBoard = await this.boardModel.findById(
            savers[k].savedPins[i].boardId,
          );
          for (let j = 0; j < pinBoard.pins.length; j++) {
            if (String(pinBoard.pins[j]) == String(pinId)) {
              pinBoard.pins.splice(j, 1);
              await pinBoard.save();
              break;
            }
          }
          savers[k].savedPins.splice(i, 1);
          await savers[k].save();
          break;
        }
      }
    }
    let topic = await this.topicModel.findOne({ name: pin.topic });
    if (topic) {
      for (var i = 0; i < topic.pins.length; i++) {
        if (String(topic.pins[i]) == String(pinId)) {
          topic.pins.splice(i, 1);
          await topic.save();
        }
      }
    }
    await this.pinModel.deleteOne({ _id: pinId });
    return true;
  }
  async deletePinFromBoardSection(pinId, userId, boardId, sectionId) {
    if (
      (await this.ValidationService.checkMongooseID([
        pinId,
        boardId,
        userId,
      ])) == 0
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
        'this user is unauthorized to delete pins from this board ',
      );
    }
    let found = false;
    console.log(pinId);
    found = await this.unsavePin(pinId, boardId, sectionId, userId, true);
    if (found) return true;

    for (let i = 0; i < user.pins.length; i++) {
      if (String(user.pins[i].pinId) == String(pinId)) {
        await this.deletePin(pinId, userId);
        found = true;
        break;
      }
    }

    if (!found) {
      console.log('ssss3');
      for (let i = 0; i < board.collaborators.length; i++) {
        let collaborator = await this.UserService.getUserById(
          board.collaborators[i].collaboratorId,
        );
        if (collaborator) {
          for (let j = 0; j < collaborator.pins.length; j++) {
            if (String(collaborator.pins[j].pinId) == String(pinId)) {
              await this.deletePin(
                pinId,
                board.collaborators[i].collaboratorId,
              );
              found = true;
              break;
            }
          }
        }
      }
    }
    return found;
  }
  async deleteBoard(userId, boardId) {
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
        'this user is unauthorized to delete this board ',
      );
    }
    for (var i = 0; i < user.boards.length; i++) {
      if (String(user.boards[i].boardId) == String(boardId)) {
        user.boards.splice(i, 1);
        await user.save();
        break;
      }
    }
    for (var k = 0; k < board.collaborators.length; k++) {
      let collaborator = await this.UserService.getUserById(
        board.collaborators[k].collaboratorId,
      );
      if (collaborator) {
        for (var i = 0; i < collaborator.boards.length; i++) {
          if (String(collaborator.boards[i].boardId) == String(boardId)) {
            collaborator.boards.splice(i, 1);
            await collaborator.save();
            break;
          }
        }
      }
    }
    for (let i = 0; i < board.pins.length; i++) {
      let isDeleted = await this.deletePinFromBoardSection(
        board.pins[i],
        userId,
        boardId,
        undefined,
      );
      if (!isDeleted) {
        throw new Error("error while deleting board's pins");
      }
    }
    for (let i = 0; i < board.sections.length; i++) {
      for (let k = 0; k < board.sections[i].pins.length; k++) {
        let isDeleted = await this.deletePinFromBoardSection(
          board.sections[i].pins[k],
          userId,
          boardId,
          board.sections[i]._id,
        );
        if (!isDeleted) {
          throw new Error("error while deleting board's pins");
        }
      }
    }
    let isBoardDeleted = await board.deleteOne();
    if (isBoardDeleted) return true;
    return false;
  }

  async deleteBoardInMerge(userId, boardId) {
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
        'this user is unauthorized to delete this board ',
      );
    }
    for (let i = 0; i < user.boards.length; i++) {
      if (String(user.boards[i].boardId) == String(boardId)) {
        user.boards.splice(i, 1);
        await user.save();
        break;
      }
    }
    for (let k = 0; k < board.collaborators.length; k++) {
      let collaborator = await this.UserService.getUserById(
        board.collaborators[k].collaboratorId,
      );
      if (collaborator) {
        for (let i = 0; i < collaborator.boards.length; i++) {
          if (String(collaborator.boards[i].boardId) == String(boardId)) {
            collaborator.boards.splice(i, 1);
            await collaborator.save();
            break;
          }
        }
      }
    }

    let isBoardDeleted = await board.deleteOne();
    if (isBoardDeleted) return true;
    return false;
  }
  async createSection(boardId, sectionName, userId) {
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
        'this user is unauthorized to create section in this board',
      );
    }
    if (!sectionName || sectionName == '') {
      throw new BadRequestException('not valid section name');
    }
    if (!board.sections) board.sections = [];
    let section = <section>(<unknown>{
      sectionName: sectionName,
      creatorId: userId,
      pins: [],
      coverImages: [],
    });
    board.sections.push(section);
    await board.save();
    return section;
  }
  async checkBoardHasSection(board, sectionId): Promise<Boolean> {
    if ((await this.ValidationService.checkMongooseID([sectionId])) == 0) {
      throw new BadRequestException('not valid section id');
    }
    for (let i = 0; i < board.sections.length; i++) {
      if (String(board.sections[i]._id) == String(sectionId)) {
        return true;
      }
    }
    return false;
  }
  async merge(boardOriginalId, boardMergedId, userId) {
    if (
      (await this.ValidationService.checkMongooseID([
        boardOriginalId,
        boardMergedId,
        userId,
      ])) == 0
    ) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    let boardOriginal = await this.boardModel.findById(boardOriginalId);
    let boardMerged = await this.boardModel.findById(boardMergedId);
    if (!boardOriginal || !boardMerged) {
      throw new BadRequestException('not valid boards');
    }

    let isAuthorized = await this.authorizedBoard(boardOriginal, userId);
    if (
      !(String(user._id) == String(boardMerged.creator.id)) ||
      !isAuthorized
    ) {
      throw new UnauthorizedException(
        'user is unauthorized to merge these boards',
      );
    }
    if (!boardOriginal.sections) boardOriginal.sections = [];

    let originalName =
      boardMerged.sections.length == 0
        ? boardMerged.name
        : `${boardMerged.name}-Other`;
    let section = <section>(<unknown>{
      sectionName: originalName,
      pins: boardMerged.pins,
      creatorId: userId,
      coverImages: boardMerged.coverImages,
    });
    boardOriginal.sections.push(section);
    for (let i = 0; i < boardMerged.pins.length; i++) {
      await this.editPin(
        boardMerged.pins[i],
        boardOriginalId,
        section._id,
        userId,
      );
    }
    for (let i = 0; i < boardMerged.sections.length; i++) {
      section = <section>(<unknown>{
        sectionName: `${boardMerged.name}-${boardMerged.sections[i].sectionName}`,
        pins: boardMerged.sections[i].pins,
        creatorId: userId,
        coverImages: boardMerged.sections[i].coverImages,
      });

      boardOriginal.sections.push(section);
      for (let j = 0; j < boardMerged.sections[i].pins.length; j++) {
        await this.editPin(
          boardMerged.sections[i].pins[j],
          boardOriginalId,
          section._id,
          userId,
        );
      }
    }
    let checkDeleted = await this.deleteBoardInMerge(userId, boardMergedId);
    if (!checkDeleted) {
      throw new Error('boards couldnt be merged');
    }
    await boardOriginal.save();
    return boardOriginal;
  }
  async deleteSection(boardId, sectionId, userId) {
    if (
      (await this.ValidationService.checkMongooseID([
        boardId,
        userId,
        sectionId,
      ])) == 0
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

    for (let i = 0; i < board.sections.length; i++) {
      if (String(board.sections[i]._id) == String(sectionId)) {
        let isAuthorized =
          String(board.sections[i].creatorId) == String(userId) ||
          String(board.creator.id) == String(userId);
        if (!isAuthorized) {
          throw new UnauthorizedException(
            'this user is unauthorized to delete the section',
          );
        }
        for (let k = 0; k < board.sections[i].pins.length; k++) {
          let isDeleted = await this.deletePinFromBoardSection(
            String(board.sections[i].pins[k]),
            userId,
            boardId,
            String(board.sections[i]._id),
          );
          if (!isDeleted) {
            throw new Error("error while deleting section's pins");
          }
        }
        board.sections.splice(i, 1);
        await board.save().catch(err => {
          console.log(err);
        });
        return true;
      }
    }
    return false;
  }
  async unsavePin(pinId, boardId, sectionId, userId, isDelete) {
    if (
      (await this.ValidationService.checkMongooseID([
        boardId,
        userId,
        sectionId,
        pinId,
      ])) == 0
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
    let pin = await this.pinModel.findById(pinId);
    if (!pin) {
      throw new BadRequestException('not valid pin');
    }

    if (String(userId) != String(board.creator.id)) {
      throw new UnauthorizedException();
    }
    let found = false;
    if (!isDelete) {
      if (sectionId) {
        for (let k = 0; k < board.sections.length; k++) {
          if (String(board.sections[k]._id) == String(sectionId)) {
            for (let i = 0; i < board.sections[k].pins.length; i++) {
              if (String(board.sections[k].pins[i]) == String(pinId)) {
                board.sections[k].pins.splice(i, 1);
                await board.save();
                break;
              }
            }
            break;
          }
        }
      } else {
        for (let i = 0; i < board.pins.length; i++) {
          if (String(board.pins[i]) == String(pinId)) {
            board.pins.splice(i, 1);
            await board.save();
            break;
          }
        }
      }
    }
    for (let j = 0; j < user.savedPins.length; j++) {
      if (String(user.savedPins[j].pinId) == String(pinId)) {
        user.savedPins.splice(j, 1);
        console.log('aaa');
        found = true;
        await user.save().catch(err => {
          console.log(err);
        });
        console.log(user.savedPins);
        break;
      }
    }
    if (!found) {
      for (let i = 0; i < board.collaborators.length; i++) {
        let collaborator = await this.UserService.getUserById(
          board.collaborators[i].collaboratorId,
        );
        if (collaborator) {
          for (let j = 0; j < collaborator.savedPins.length; j++) {
            if (String(collaborator.savedPins[j].pinId) == String(pinId)) {
              collaborator.savedPins.splice(j, 1);
              found = true;
              break;
            }
          }
        }
      }
    }

    return found;
  }
  async editPin(pinId, boardId, sectionId, userId) {
    if (
      (await this.ValidationService.checkMongooseID([
        boardId,
        pinId,
        sectionId,
        userId,
      ])) == 0
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
    let pin = await this.pinModel.findById(pinId);
    if (!pin) {
      throw new BadRequestException('not valid pin');
    }
    let found = false;
    for (let i = 0; i < user.pins.length; i++) {
      if (String(user.pins[i].pinId) == String(pinId)) {
        user.pins[i].boardId = boardId;
        user.pins[i].sectionId = sectionId;
        pin.board = boardId;
        pin.section = sectionId;
        await user.save();
        await pin.save();
        found = true;
        break;
      }
    }
    for (let i = 0; i < user.savedPins.length; i++) {
      if (String(user.savedPins[i].pinId) == String(pinId)) {
        user.savedPins[i].boardId = boardId;
        user.savedPins[i].sectionId = sectionId;
        await user.save();
        found = true;
        break;
      }
    }
    if (!found) {
      for (let i = 0; i < board.collaborators.length; i++) {
        let collaborator = await this.UserService.getUserById(
          board.collaborators[i].collaboratorId,
        );
        if (collaborator) {
          for (let j = 0; j < collaborator.pins.length; j++) {
            if (String(collaborator.pins[j].pinId) == String(pinId)) {
              user.pins.push({
                pinId: collaborator.pins[j].pinId,
                boardId: boardId,
                sectionId: sectionId,
              });
              pin.creator.id = userId;
              pin.creator.lastName = user.lastName;
              pin.creator.firstName = user.firstName;
              pin.board = boardId;
              pin.section = sectionId;
              collaborator.pins.splice(j, 1);
              await user.save();
              await collaborator.save();
              await pin.save();
              found = true;
              break;
            }
          }
          if (!found) {
            for (let j = 0; j < collaborator.savedPins.length; j++) {
              if (String(collaborator.savedPins[j].pinId) == String(pinId)) {
                user.savedPins.push({
                  pinId: collaborator.savedPins[j].pinId,
                  boardId: boardId,
                  sectionId: sectionId,
                  note: '',
                });
                collaborator.savedPins.splice(j, 1);
                await user.save();
                await collaborator.save();
                found = true;
                break;
              }
            }
          }
        }
        if (found) {
          break;
        }
      }
    }

    return true;
  }

  async getBoardFull(boardId, userId) {
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
    let pins = [];
    for (let i = 0; i < board.pins.length; i++) {
      let pinType = 'none';
      let pin = await this.pinModel.findById(board.pins[i]);
      if (String(pin.creator.id) == String(userId)) {
        pinType = 'creator';
      } else {
        for (let k = 0; k < user.savedPins.length; k++) {
          if (String(user.savedPins[k].pinId) == String(pin._id)) {
            pinType = 'saved';
            break;
          }
        }
      }
      if (pin) {
        pins.push({ pin: pin, type: pinType });
      }
    }
    let type = 'none';
    let permissions = {};
    if (String(userId) == String(board.creator.id)) {
      type = 'creator';
    } else {
      for (let i = 0; i < board.collaborators.length; i++) {
        if (String(userId) == String(board.collaborators[i].collaboratorId)) {
          type = 'collaborator';
          permissions = {
            savePin: board.collaborators[i].savePin,
            createPin: board.collaborators[i].createPin,
            addCollaborators: board.collaborators[i].addCollaborators,
            editDescription: board.collaborators[i].editDescription,
            editTitle: board.collaborators[i].editTitle,
            personalization: board.collaborators[i].personalization,
          };
          break;
        }
      }
    }
    return { board: board, pins: pins, type: type, permissions: permissions };
  }
}
