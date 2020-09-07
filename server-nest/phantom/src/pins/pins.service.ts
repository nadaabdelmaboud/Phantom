import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  NotAcceptableException,
} from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/shared/user.service';
import { ValidationService } from '../shared/validation.service';
import { CreatePinDto } from './dto/create-pin.dto';
import { pin } from '../types/pin';
import { comment } from '../types/pin';
import { reply } from '../types/pin';
import { BoardService } from '../board/board.service';
import { board } from 'src/types/board';
import { topic } from 'src/types/topic';
@Injectable()
export class PinsService {
  constructor(
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Board') private readonly boardModel: Model<board>,
    private UserService: UserService,
    private ValidationService: ValidationService,
    private BoardService: BoardService,
    private NotificationService: NotificationService,
  ) {}
  async getPinById(pinId): Promise<pin> {
    try {
      if ((await this.ValidationService.checkMongooseID([pinId])) == 0)
        throw new Error('not valid id');
      const pin = await this.pinModel.findById(pinId);
      return pin;
    } catch (ex) {
      throw new Error('pin not found');
    }
  }
  async getPinFull(pinId, userId): Promise<Object> {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0)
      throw new Error('not valid id');

    let pinType = 'none';
    let pin = await this.pinModel.findById(pinId);
    let user = await this.UserService.getUserById(userId);
    let creator = await this.UserService.getUserById(pin.creator.id);
    if (!user) throw new NotFoundException({ message: 'user not found' });
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
    let react = 'none';
    for (let i = 0; i < pin.reacts.length; i++) {
      if (String(pin.reacts[i].userId) == String(userId)) {
        react = pin.reacts[i].reactType.toString();
        break;
      }
    }
    if (pin) {
      let creatorInfo = {};
      if (creator) {
        creatorInfo = {
          creatorImage: creator.profileImage,
          followers: creator.followers.length,
        };
      }
      if (!user.history) user.history = [];
      user.history.push({
        topic: pin.topic,
        pinId: pin._id,
      });
      await user.save();
      return {
        pin: pin,
        type: pinType,
        creatorInfo: creatorInfo,
        react: react,
      };
    }

    return { success: false };
  }
  async createPin(userId: String, createPinDto: CreatePinDto): Promise<pin> {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        createPinDto.board,
      ])) == 0
    )
      throw new BadRequestException({ message: 'user/board id not valid' });
    let user = await this.UserService.getUserById(userId);
    console.log(user);
    if (!user) throw new NotFoundException({ message: 'user not found' });
    let board = await this.BoardService.getBoardById(createPinDto.board);
    if (!board) {
      throw new NotFoundException({ message: 'board not found' });
    }
    let isCreator = await this.BoardService.isCreator(board, userId);
    let isCollaborator = await this.BoardService.isCollaborator(board, userId);
    if (!isCreator && !(isCollaborator && isCollaborator.createPin)) {
      throw new UnauthorizedException(
        'this user is unauthorized to add pin to this board',
      );
    }
    let section = null;
    if (createPinDto.section) {
      let checkSection = await this.BoardService.checkBoardHasSection(
        board,
        createPinDto.section,
      );
      if (checkSection) {
        section = createPinDto.section;
      }
    }
    let pin = new this.pinModel({
      imageId: createPinDto.imageId,
      imageWidth: createPinDto.imageWidth,
      imageHeight: createPinDto.imageHeight,
      destLink: createPinDto.link,
      section: section,
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
    await this.BoardService.addPintoBoard(
      pin._id,
      createPinDto.board,
      createPinDto.section,
    );
    await this.addPintoUser(
      userId,
      pin._id,
      createPinDto.board,
      createPinDto.section,
    );
    return pin;
  }
  async addPintoUser(userId, pinId, boardId, sectionId) {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    if (sectionId) {
      if ((await this.ValidationService.checkMongooseID([sectionId])) == 0) {
        throw new BadRequestException('not valid id');
      }
    } else {
      sectionId = null;
    }
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    user.pins.push({
      pinId: pinId,
      boardId: boardId,
      sectionId: sectionId,
    });
    await user.save();
    return true;
  }
  async getCurrentUserPins(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      return false;
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) return false;
    let retPins = [];
    for (var i = 0; i < user.pins.length; i++) {
      let pinFound = await this.pinModel.findById(user.pins[i].pinId);
      if (pinFound) {
        retPins.push(pinFound);
      }
    }
    return retPins;
  }
  async savePin(userId, pinId, boardId, sectionId) {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        boardId,
      ])) == 0
    ) {
      throw new BadRequestException('not valid id');
    }

    let user = await this.UserService.getUserById(userId);
    if (!user) return 0;
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let board = await this.BoardService.getBoardById(boardId);
    if (!board) {
      throw new NotFoundException({ message: 'board not found' });
    }
    let isCreator = await this.BoardService.isCreator(board, userId);
    let isCollaborator = await this.BoardService.isCollaborator(board, userId);
    if (!isCreator && !(isCollaborator && isCollaborator.savePin)) {
      throw new UnauthorizedException(
        'this user is unauthorized to save pin to this board',
      );
    }
    let found = false;
    for (var i = 0; i < user.savedPins.length; i++) {
      if (String(user.savedPins[i].pinId) == String(pinId)) {
        found = true;
        break;
      }
    }
    if (!found) {
      let section = null;
      if (sectionId) {
        if ((await this.ValidationService.checkMongooseID([sectionId])) == 0) {
          throw new BadRequestException('not valid section id');
        }
        let checkSection = await this.BoardService.checkBoardHasSection(
          board,
          sectionId,
        );
        if (checkSection) {
          section = sectionId;
        }
      }

      user.savedPins.push({
        pinId: pinId,
        boardId: boardId,
        sectionId: section,
        note: '',
      });
      pin.savers.push(userId);
    } else {
      return false;
    }
    if (boardId && boardId != undefined) {
      if ((await this.ValidationService.checkMongooseID([boardId])) != 0) {
        await this.BoardService.addPintoBoard(pinId, boardId, sectionId);
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
    let retPins = [];
    for (var i = 0; i < user.savedPins.length; i++) {
      let pinFound = await this.pinModel.findById(user.savedPins[i].pinId);
      if (pinFound) {
        retPins.push(pinFound);
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
    let ownerUser = await this.UserService.getUserById(pin.creator.id);

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
    await this.NotificationService.commentPin(
      ownerUser,
      user,
      commentText,
      pin.title,
      pinId,
      pin.imageId,
    );
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
    let pinOwner = await this.getPinById(pin.creator.id);
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
        await this.NotificationService.reactPin(
          pinOwner,
          user,
          pin.title,
          pinId,
          String(reactType),
          pin.imageId,
        );
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
  //edit pin
  async editCreatedPin(
    pinId,
    userId,
    boardId,
    sectionId,
    description,
    title,
    link,
  ) {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    let pin = await this.pinModel.findById(pinId);
    if (!pin) {
      throw new BadRequestException('not valid pin');
    }
    if (pin.creator.id != userId) {
      throw new UnauthorizedException();
    }
    for (let i = 0; i < user.pins.length; i++) {
      if (String(user.pins[i].pinId) == String(pinId)) {
        if (
          boardId &&
          (await this.ValidationService.checkMongooseID([boardId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId);
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );
          if (checkBoard) {
            user.pins[i].boardId = boardId;
            pin.board = boardId;
          }
        }
        if (
          sectionId &&
          (await this.ValidationService.checkMongooseID([sectionId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId);
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );
          let checkSection = await this.BoardService.checkBoardHasSection(
            board,
            sectionId,
          );
          if (checkBoard && checkSection) {
            user.pins[i].boardId = boardId;
            pin.board = boardId;
            user.pins[i].sectionId = sectionId;
            pin.section = sectionId;
          }
        }
        if (title) {
          pin.title = title;
        }
        if (description) {
          pin.note = description;
        }
        if (link) {
          pin.destLink = link;
        }
        await user.save();
        await pin.save();
        break;
      }
    }
    return pin;
  }
  async editSavedPin(pinId, userId, boardId, sectionId, note) {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.UserService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    let pin = await this.pinModel.findById(pinId);
    if (!pin) {
      throw new BadRequestException('not valid pin');
    }

    for (let i = 0; i < user.savedPins.length; i++) {
      if (String(user.savedPins[i].pinId) == String(pinId)) {
        if (
          boardId &&
          (await this.ValidationService.checkMongooseID([boardId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId);
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );
          if (checkBoard) {
            user.savedPins[i].boardId = boardId;
          }
        }
        if (
          sectionId &&
          (await this.ValidationService.checkMongooseID([sectionId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId);
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );
          let checkSection = await this.BoardService.checkBoardHasSection(
            board,
            sectionId,
          );
          if (checkBoard && checkSection) {
            user.savedPins[i].boardId = boardId;
            user.savedPins[i].sectionId = sectionId;
          }
        }
        if (note) {
          user.savedPins[i].note = note;
        }
        await user.save();
        break;
      }
    }
    return true;
  }

  async getFollowingPins(userId) {
    const user = await this.UserService.getUserById(userId);
    var pins = [];
    console.log(pins);
    for (let i = 0; i < user.following.length; i++) {
      var userPin = await this.getCurrentUserPins(user.following[i]);
      console.log(pins);
      pins = await pins.concat(userPin);
      console.log(pins);
    }
    console.log(pins);
    return pins;
  }
}
