import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/shared/user.service';
import { ValidationService } from '../shared/validation.service';
import { createPinDto } from './dto/create-pin.dto';
import { pin } from '../types/pin';
import { comment } from '../types/pin';
import { reply } from '../types/pin';
import { BoardService } from '../board/board.service';
import { board } from 'src/types/board';
@Injectable()
export class PinsService {
  constructor(
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Board') private readonly boardModel: Model<board>,
    private UserService: UserService,
    private ValidationService: ValidationService,
    private BoardService: BoardService,
  ) {}
  async getPinById(pinId): Promise<pin> {
    try {
      if ((await this.ValidationService.checkMongooseID([pinId])) == 0)
        throw new Error('not mongoose id');
      const pin = await this.pinModel.findById(pinId);
      return pin;
    } catch (ex) {
      throw new Error('pin not found');
    }
  }
  async createPin(userId: String, createPinDto: createPinDto): Promise<pin> {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new BadRequestException({ message: 'user id not valid' });
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new NotFoundException({ message: 'user not found' });
    let board = await this.BoardService.getBoardById(createPinDto.board);
    if (!board) {
      throw new NotFoundException({ message: 'board not found' });
    }
    if (!(await this.BoardService.authorizedBoard(board, userId))) {
      throw new UnauthorizedException(
        'this user is unauthorized to add pin to this board',
      );
    }
    let pin = new this.pinModel({
      imageId: createPinDto.imageId,
      imageWidth: createPinDto.imageWidth,
      imageHeight: createPinDto.imageHeight,
      destLink: createPinDto.link,
      title: createPinDto.title,
      creator: {
        firstName: user.firstName,
        lastName: user.lastName,
        id: userId,
      },
      board: createPinDto.board,
      createdAt: Date.now(),
      note: createPinDto.note,
      comments: [],
      counts: {
        comments: 0,
        thanksReacts: 0,
        loveReacts: 0,
        wowReacts: 0,
        goodIdeaReacts: 0,
        hahaReacts: 0,
      },
      reacts: [],
    });
    await pin.save();
    await this.BoardService.addPintoBoard(pin._id, createPinDto.board);
    await this.addPintoUser(userId, pin._id);
    return pin;
  }
  async addPintoUser(userId, pinId) {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0) {
      return false;
    }
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    user.pins.push(pinId);
    await user.save();
    return true;
  }
  async getCurrentUserPins(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    let allPins = await this.pinModel.find({});
    let retPins = [];
    for (var i = 0; i < user.pins.length; i++) {
      for (var j = 0; j < allPins.length; j++) {
        if (String(user.pins[i]) == String(allPins[j]._id)) {
          retPins.push(allPins[j]);
        }
      }
    }
    return retPins;
  }
  async savePin(userId, pinId, boardId) {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        boardId,
      ])) == 0
    ) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) return 0;
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let board = await this.BoardService.getBoardById(boardId);
    if (!board) {
      throw new NotFoundException({ message: 'board not found' });
    }
    if (!(await this.BoardService.authorizedBoard(board, userId))) {
      throw new UnauthorizedException(
        'this user is unauthorized to save pin to this board',
      );
    }
    let found = false;
    for (var i = 0; i < user.savedPins.length; i++) {
      if (String(user.savedPins[i]) == String(pinId)) {
        found = true;
        break;
      }
    }
    if (!found) {
      user.savedPins.push(pinId);
    } else {
      return false;
    }
    if (boardId && boardId != undefined) {
      if ((await this.ValidationService.checkMongooseID([boardId])) != 0) {
        await this.BoardService.addPintoBoard(pinId, boardId);
      }
    }
    await user.save();
    return true;
  }
  async getCurrentUserSavedPins(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    let allPins = await this.pinModel.find({});
    let retPins = [];
    for (var i = 0; i < user.savedPins.length; i++) {
      for (var j = 0; j < allPins.length; j++) {
        if (String(user.savedPins[i]) == String(allPins[j]._id)) {
          retPins.push(allPins[j]);
        }
      }
    }
    return retPins;
  }
  async createComment(pinId, commentText, userId) {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    let pin = await this.getPinById(pinId);
    var cs = <comment>(<unknown>{
      commenter: userId,
      comment: commentText,
      date: new Date(Date.now()),
      replies: [],
      likes: {
        counts: 0,
        likers: [],
      },
    });
    if (!user || !pin) return false;
    pin.comments.push(cs);
    pin.counts.comments = pin.counts.comments.valueOf() + 1;
    await pin.save();
    return true;
  }
  async createReply(pinId, replyText, userId, commentId) {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        commentId,
      ])) == 0
    ) {
      return false;
    }
    console.log('user');
    let user = await this.UserService.getUserById(userId);
    let pin = await this.getPinById(pinId);

    if (!user || !pin) return false;
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        var rp = <reply>(<unknown>{
          replier: userId,
          reply: replyText,
          date: new Date(Date.now()),
          likes: {
            counts: 0,
            likers: [],
          },
        });
        pin.comments[i].replies.push(rp);
        await pin.save();
        return true;
      }
    }
    return false;
  }
  async getPinCommentsReplies(pinId) {
    if ((await this.ValidationService.checkMongooseID([pinId])) == 0) {
      return false;
    }
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let retComments = [];
    for (var i = 0; i < pin.comments.length; i++) {
      let commenter = await this.UserService.getUserById(
        pin.comments[i].commenter,
      );
      if (commenter) {
        let comment = {
          commenter: pin.comments[i].commenter,
          commenterName: commenter.firstName + ' ' + commenter.lastName,
          commenterImage: commenter.profileImage,
          commentText: pin.comments[i].comment,
          date: pin.comments[i].date,
          likes: pin.comments[i].likes,
        };
        let replies = [];
        for (var j = 0; j < pin.comments[i].replies.length; j++) {
          let replier = await this.UserService.getUserById(
            pin.comments[i].replies[j].replier,
          );
          if (replier) {
            let reply = {
              replier: pin.comments[i].replies[j].replier,
              replierName: replier.firstName + ' ' + replier.lastName,
              replierImage: replier.profileImage,
              replyText: pin.comments[i].replies[j].reply,
              date: pin.comments[i].replies[j].date,
              likes: pin.comments[i].replies[j].likes,
            };
            replies.push(reply);
          }
        }
        retComments.push({ comment: comment, replies: replies });
      }
    }
    return retComments;
  }
  async createReact(pinId, reactType, userId) {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0) {
      return false;
    }
    if (
      String(reactType) != 'Wow' &&
      String(reactType) != 'Love' &&
      String(reactType) != 'Good idea' &&
      String(reactType) != 'Thanks' &&
      String(reactType) != 'Haha'
    ) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    let pin = await this.getPinById(pinId);

    if (!user || !pin) return false;
    pin.reacts.push({
      reactType: reactType,
      userId: userId,
    });
    switch (reactType) {
      case 'Wow':
        pin.counts.wowReacts = pin.counts.wowReacts.valueOf() + 1;
        break;
      case 'Love':
        pin.counts.loveReacts = pin.counts.loveReacts.valueOf() + 1;
        break;
      case 'Haha':
        pin.counts.hahaReacts = pin.counts.hahaReacts.valueOf() + 1;
        break;
      case 'Thanks':
        pin.counts.thanksReacts = pin.counts.thanksReacts.valueOf() + 1;
        break;
      case 'Good idea':
        pin.counts.goodIdeaReacts = pin.counts.goodIdeaReacts.valueOf() + 1;
        break;
    }
    await pin.save();
    return true;
  }
  async likeComment(pinId, commentId, userId) {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        commentId,
      ])) == 0
    ) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    let pin = await this.getPinById(pinId);
    if (!user || !pin) return false;
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        pin.comments[i].likes.likers.push(userId);
        pin.comments[i].likes.counts =
          pin.comments[i].likes.counts.valueOf() + 1;
        await pin.save();
        return true;
      }
    }
    return false;
  }
  async likeReply(pinId, commentId, userId, replyId) {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        commentId,
        replyId,
      ])) == 0
    ) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    let pin = await this.getPinById(pinId);
    if (!user || !pin) return false;
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        for (var j = 0; j < pin.comments[i].replies.length; j++) {
          if (String(pin.comments[i].replies[j]._id) == String(replyId)) {
            pin.comments[i].replies[j].likes.likers.push(userId);
            pin.comments[i].replies[j].likes.counts =
              pin.comments[i].replies[j].likes.counts.valueOf() + 1;
            await pin.save();
            return true;
          }
        }
      }
    }
    return false;
  }
}
