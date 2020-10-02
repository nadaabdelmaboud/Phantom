import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { NotificationService } from '../shared/notification.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ValidationService } from '../shared/validation.service';
import { Email } from '../shared/send-email.service';
import { CreatePinDto } from './dto/create-pin.dto';
import { pin } from '../types/pin';
import { comment } from '../types/pin';
import { reply } from '../types/pin';
import { BoardService } from '../board/board.service';
import { board } from '../types/board';
import { topic } from '../types/topic';
import { user } from '../types/user';
import { HelpersUtils } from '../utilities/helpers.utils';

/**
 * @module Pins
 */
@Injectable()
export class PinsService {
  private HelpersUtils: HelpersUtils;
  constructor(
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('User') private readonly userModel: Model<user>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    private ValidationService: ValidationService,
    private BoardService: BoardService,
    private NotificationService: NotificationService,
    private EmailService: Email,
  ) {
    this.HelpersUtils = new HelpersUtils();
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get pin document
   * @param {string} pinId - the id of the pin
   * @returns  {Promise<pin>}
   */
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
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get full pin object with creator data , user&pin type (creator-saved-none) , user&react type
   * @param {string} pinId - the id of the pin
   * @param {string} userId - the id of the user
   * @returns  {Promise<object>}
   */
  async getPinFull(pinId, userId): Promise<object> {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0)
      throw new Error('not valid id');

    let pinType = 'none';
    let pin = await this.pinModel
      .findById(pinId, {
        creator: 1,
        reacts: 1,
        topic: 1,
        imageId: 1,
        title: 1,
        note: 1,
        imageHeight: 1,
        imageWidth: 1,
        comments: 1,
        counts: 1,
      })
      .lean();

    let user = await this.userModel.findById(userId, {
      savedPins: 1,
      history: 1,
      lastTopics: 1,
    });

    let creator = await this.userModel
      .findById(pin.creator.id, {
        profileImage: 1,
        followers: 1,
        google: 1,
        googleImage: 1,
      })
      .lean();
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
          google: creator.google,
          googleImage: creator.googleImage,
        };
      }
      if (!user.history) user.history = [];
      user.history.push({
        topic: pin.topic,
        pinId: pin._id,
      });
      user.lastTopics = [];
      await user.save();
      if (!user.lastTopics) user.lastTopics = [];
      if (pin.topic && pin.topic != undefined && pin.topic != 'undefined') {
        let topic = await this.topicModel
          .aggregate()
          .match({ name: pin.topic })
          .project({ pins: { $size: '$pins' } });
        if (user.lastTopics.length > 0) {
          if (
            user.lastTopics[user.lastTopics.length - 1].topicName == pin.topic
          ) {
            await user.save();
            return {
              pin: pin,
              type: pinType,
              creatorInfo: creatorInfo,
              react: react,
            };
          }
        }
        user.lastTopics.push({
          topicName: pin.topic,
          pinsLength: topic[0].pins,
        });
        if (user.lastTopics.length > 5) {
          user.lastTopics = user.lastTopics.slice(1, 5);
        }
      }
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
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description create new pin
   * @param {CreatePinDto} CreatePinDto - the create pin object
   * @param {string} userId - the id of the user
   * @returns  {Promise<object>}
   */
  async createPin(userId: String, createPinDto: CreatePinDto): Promise<object> {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        createPinDto.board,
      ])) == 0
    )
      throw new BadRequestException({ message: 'user/board id not valid' });
    let user = await this.userModel
      .findById(userId, {
        firstName: 1,
        lastName: 1,
      })
      .lean();
    if (!user) throw new NotFoundException({ message: 'user not found' });
    let board = await this.boardModel.findById(createPinDto.board, {
      sections: 1,
      creator: 1,
      collaborators: 1,
    });
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
      topic: createPinDto.topicName,
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
    await pin.save().catch(err => {
      console.log(err);
    });
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
    await this.pinModel.ensureIndexes();
    return {
      board: pin.board,
      section: pin.section,
      _id: pin._id,
      imageId: pin.imageId,
    };
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get pin related data (board belongs to , section belongs to , user&pin relation)
   * @param {string} pinId - the id of the pin
   * @param {string} userId - the id of the user
   * @returns  {Promise<object>}
   */
  async checkPinStatus(pinId, userId): Promise<object> {
    let pinType = 'none';
    let boardName = 'none';
    let pin = await this.pinModel
      .findById(pinId, {
        creator: 1,
        board: 1,
        section: 1,
      })
      .lean();

    let user = await this.userModel
      .findById(userId, {
        savedPins: 1,
      })
      .lean();
    let boardId = 'none';
    let sectionId = 'none';
    let sectionName = 'none';

    if (!user) throw new NotFoundException({ message: 'user not found' });
    if (String(pin.creator.id) == String(userId)) {
      pinType = 'creator';
      let board = await this.boardModel
        .findById(pin.board, { name: 1, sections: 1 })
        .lean();
      if (board) {
        boardName = String(board.name);
        boardId = board._id;
      }
      if (pin.section) {
        for (let i = 0; i < board.sections.length; i++) {
          if (String(board.sections[i]._id) == String(pin.section)) {
            sectionId = String(pin.section);
            sectionName = String(board.sections[i].sectionName);
            break;
          }
        }
      }
    } else {
      for (let k = 0; k < user.savedPins.length; k++) {
        if (String(user.savedPins[k].pinId) == String(pin._id)) {
          pinType = 'saved';
          let board = await this.boardModel
            .findById(user.savedPins[k].boardId, { name: 1, sections: 1 })
            .lean();
          if (board) {
            boardName = String(board.name);
            boardId = board._id;
          }
          if (user.savedPins[k].sectionId) {
            for (let i = 0; i < board.sections.length; i++) {
              if (
                String(board.sections[i]._id) ==
                String(user.savedPins[k].sectionId)
              ) {
                sectionId = String(user.savedPins[k].sectionId);
                sectionName = String(board.sections[i].sectionName);
                break;
              }
            }
          }
          break;
        }
      }
    }
    return {
      board: boardName,
      type: pinType,
      boardId: boardId,
      sectionId: sectionId,
      section: sectionName,
    };
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description add pin to a certain user
   * @param {string} pinId - the id of the pin
   * @param {string} userId - the id of the user
   * @param {string} boardId - the id of the pin
   * @param {string} sectionId - the id of the user
   * @returns  {Promise<boolean>}
   */
  async addPintoUser(userId, pinId, boardId, sectionId): Promise<boolean> {
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
    let user = await this.userModel.findById(userId, { pins: 1 });
    if (!user) throw new NotFoundException('no such user');
    user.pins.push({
      pinId: pinId,
      boardId: boardId,
      sectionId: sectionId,
    });
    await user.save();
    return true;
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get user pins
   * @param {string} userId - the id of the user
   * @param {boolean} ifMe - flag indicates if current user or another user
   * @param {number} limit - the limit of user pins returned
   * @returns  {Promise<Array<object>}
   */
  async getCurrentUserPins(userId, ifMe, limit, isFollow): Promise<Array<pin>> {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid Id');
    }
    let user;
    if (ifMe == true)
      user = await this.userModel.findById(userId, { pins: 1 }).lean();
    else user = await this.userModel.findById(userId, { pins: 1, email: 1 });

    if (!user) throw new BadRequestException('no such user');
    if (!ifMe && !isFollow && user.email == process.env.ADMIN_EMAIL) {
      return [];
    }
    let retPins = [];
    if (!limit || limit > user.pins.length) limit = user.pins.length;
    for (var i = user.pins.length - 1; i >= user.pins.length - limit; i--) {
      let pinFound = await this.pinModel.findById(user.pins[i].pinId, {
        _id: 1,
        imageId: 1,
        imageWidth: 1,
        imageHeight: 1,
        title: 1,
        topic: 1,
      });
      if (pinFound) {
        retPins.push(pinFound);
      }
    }
    return retPins;
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description save pin
   * @param {string} pinId - the id of the pin
   * @param {string} userId - the id of the user
   * @param {string} boardId - the id of the pin
   * @param {string} sectionId - the id of the user
   * @returns  {Promise<object>}
   */
  async savePin(userId, pinId, boardId, sectionId): Promise<object> {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        boardId,
      ])) == 0
    ) {
      throw new BadRequestException('not valid id');
    }

    let user = await this.userModel.findById(userId, { savedPins: 1 });
    if (!user) throw new NotFoundException('no such user');
    let pin = await this.pinModel.findById(pinId, { savers: 1 });
    if (!pin) throw new NotFoundException('no such pin');
    let board = await this.boardModel.findById(boardId, {
      creator: 1,
      sections: 1,
      collaborators: 1,
    });
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
          let board = await this.boardModel.findById(boardId, { sections: 1 });
          for (let i = 0; i < board.sections.length; i++) {
            for (let j = 0; j < board.sections[i].pins.length; j++) {
              if (String(board.sections[i].pins[j].pinId) == String(pinId)) {
                throw new BadRequestException('pin is already in this section');
              }
            }
          }
          section = sectionId;
        }
      } else {
        let board = await this.boardModel.findById(boardId, { pins: 1 });
        for (let i = 0; i < board.pins.length; i++) {
          if (String(board.pins[i].pinId) == String(pinId)) {
            throw new BadRequestException('pin is already in this board');
          }
        }
      }

      user.savedPins.push({
        pinId: pinId,
        boardId: boardId,
        sectionId: section,
        note: '',
      });
      pin.savers.push(userId);
      await pin.save();
    } else {
      throw new BadRequestException('pin is already saved');
    }
    if (boardId && boardId != undefined) {
      if ((await this.ValidationService.checkMongooseID([boardId])) != 0) {
        await this.BoardService.addPintoBoard(pinId, boardId, sectionId);
      }
    }
    await user.save();
    return {
      board: pin.board,
      section: pin.section,
      _id: pin._id,
      imageId: pin.imageId,
    };
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get user saved pins
   * @param {string} userId - the id of the user
   * @returns  {Promise<Array<object>>}
   */
  async getCurrentUserSavedPins(userId): Promise<Array<object>> {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.userModel.findById(userId, { savedPins: 1 }).lean();
    if (!user) throw new NotFoundException('no such user');
    let retPins = [];
    for (var i = 0; i < user.savedPins.length; i++) {
      let pinFound = await this.pinModel
        .findById(user.savedPins[i].pinId, {
          imageId: 1,
          imageHeight: 1,
          imageWidth: 1,
          topic: 1,
        })
        .lean();
      if (pinFound) {
        retPins.push(pinFound);
      }
    }
    return retPins;
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description create a comment on a pin
   * @param {string} pinId - the id of the pin
   * @param {string} commentText - the text of the new comment
   * @param {string} userId - the id of the user
   * @returns  {Promise<object>}
   */
  async createComment(pinId, commentText, userId): Promise<object> {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    if (!commentText || commentText == '' || commentText == ' ') {
      throw new BadRequestException('comment is empty');
    }
    let user = await this.userModel.findById(userId, {
      firstName: 1,
      lastName: 1,
      profileImage: 1,
      google: 1,
      googleImage: 1,
      notificationCounter: 1,
      notifications: 1,
      fcmToken: 1,
    });
    let pin = await this.pinModel.findById(pinId, {
      title: 1,
      imageId: 1,
      comments: 1,
      counts: 1,
      creator: 1,
    });
    let ownerUser = await this.userModel.findById(pin.creator.id, {
      notifications: 1,
      offlineNotifications: 1,
      fcmToken: 1,
      notificationCounter: 1,
      pinsNotification: 1,
    });
    let cs = <comment>(<unknown>{
      commenter: userId,
      comment: commentText,
      date: new Date(Date.now()),
      replies: [],
      likes: {
        counts: 0,
        likers: [],
      },
    });
    if (!user || !pin) throw new NotFoundException();
    pin.comments.push(cs);
    pin.counts.comments = pin.counts.comments.valueOf() + 1;
    await pin.save();
    if (!ownerUser.pinsNotification || ownerUser.pinsNotification == true)
      await this.NotificationService.commentPin(
        ownerUser,
        user,
        commentText,
        pin.title,
        pinId,
        pin.imageId,
      );
    let newComment = pin.comments[pin.comments.length - 1];
    if (
      String(newComment.commenter) == String(userId) &&
      String(commentText) == String(newComment.comment)
    ) {
      return {
        comment: {
          id: newComment._id,
          commenter: newComment.commenter,
          commentText: newComment.comment,
          google: user.google,
          googleImage: user.googleImage,
          date: 'just now',
          commenterName: user.firstName + ' ' + user.lastName,
          commenterImage: user.profileImage,
          pinId: pinId,
          likes: newComment.likes,

          isLiked: false,
        },
        replies: newComment.replies,
      };
    }
    for (let i = pin.comments.length - 1; i >= 0; i--) {
      if (
        String(pin.comments[i].commenter) == String(userId) &&
        String(commentText) == String(pin.comments[i].comment)
      ) {
        return {
          comment: {
            id: pin.comments[i]._id,
            commenter: pin.comments[i].commenter,
            commentText: pin.comments[i].comment,
            date: 'just now',
            google: user.google,
            googleImage: user.googleImage,
            commenterName: user.firstName + ' ' + user.lastName,
            commenterImage: user.profileImage,
            pinId: pinId,
            likes: pin.comments[i].likes,
            isLiked: false,
          },
          replies: pin.comments[i].replies,
        };
      }
    }
    throw new Error();
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description create a reply on a comment on a pin
   * @param {string} pinId - the id of the pin
   * @param {string} replyText - the text of the new reply
   * @param {string} userId - the id of the user
   * @param {string} commentId - the id of the comment
   * @returns  {Promise<object>}
   */
  async createReply(pinId, replyText, userId, commentId): Promise<object> {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        commentId,
      ])) == 0
    ) {
      throw new BadRequestException('invalid id');
    }
    let user = await this.userModel
      .findById(userId, {
        firstName: 1,
        lastName: 1,
        profileImage: 1,
        google: 1,
        googleImage: 1,
      })
      .lean();
    if (!replyText || replyText == '' || replyText == ' ') {
      throw new BadRequestException('reply is empty');
    }
    let pin = await this.pinModel.findById(pinId, { comments: 1 });

    if (!pin) throw new NotFoundException();
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
        let newReply =
          pin.comments[i].replies[pin.comments[i].replies.length - 1];
        if (
          String(newReply.replier) == String(userId) &&
          String(replyText) == String(newReply.reply)
        ) {
          let j = pin.comments[i].replies.length - 1;
          return {
            id: pin.comments[i].replies[j]._id,
            replier: pin.comments[i].replies[j].replier,
            replyText: pin.comments[i].replies[j].reply,
            google: user.google,
            googleImage: user.googleImage,
            date: 'just now',
            commentId: commentId,
            pinId: pinId,
            replierName: user.firstName + ' ' + user.lastName,
            replierImage: user.profileImage,
            likes: pin.comments[i].replies[j].likes,
            isLiked: false,
          };
        }
        for (let j = pin.comments[i].replies.length - 1; j >= 0; j--) {
          if (
            String(pin.comments[i].replies[j].replier) == String(userId) &&
            String(replyText) == String(pin.comments[i].replies[j].reply)
          ) {
            return {
              id: pin.comments[i].replies[j]._id,
              replier: pin.comments[i].replies[j].replier,
              replyText: pin.comments[i].replies[j].reply,
              google: user.google,
              googleImage: user.googleImage,
              date: 'just now',
              commentId: commentId,
              pinId: pinId,
              replierName: user.firstName + ' ' + user.lastName,
              replierImage: user.profileImage,
              likes: pin.comments[i].replies[j].likes,
              isLiked: false,
            };
          }
        }
        throw new Error();
      }
    }
    throw new Error();
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get full detailed array of pin's comments with their replies
   * @param {string} pinId - the id of the pin
   * @param {string} userId - the id of the user
   * @returns  {Promise<Array<object>>}
   */
  async getPinCommentsReplies(pinId, userId): Promise<Array<object>> {
    if ((await this.ValidationService.checkMongooseID([pinId])) == 0) {
      throw new BadRequestException('not valid id');
    }

    let pin = await this.pinModel.findById(pinId, { comments: 1 }).lean();
    if (!pin) throw new NotFoundException('no such pin');

    let retComments = [];
    for (var i = 0; i < pin.comments.length; i++) {
      let commenter = await this.userModel
        .findById(pin.comments[i].commenter, {
          firstName: 1,
          lastName: 1,
          profileImage: 1,
          google: 1,
          googleImage: 1,
        })
        .lean();

      if (commenter) {
        let isLiked = false;
        for (let n = 0; n < pin.comments[i].likes.likers.length; n++) {
          if (String(userId) == String(pin.comments[i].likes.likers[n])) {
            isLiked = true;
          }
        }
        let comment = {
          id: pin.comments[i]._id,
          commenter: pin.comments[i].commenter,
          commenterName: commenter.firstName + ' ' + commenter.lastName,
          commenterImage: commenter.profileImage,
          google: commenter.google,
          googleImage: commenter.googleImage,
          commentText: pin.comments[i].comment,
          date: await this.HelpersUtils.dateSince(pin.comments[i].date),
          likes: pin.comments[i].likes,
          isLiked: isLiked,
        };
        let replies = [];
        for (var j = 0; j < pin.comments[i].replies.length; j++) {
          let replier = await this.userModel
            .findById(pin.comments[i].replies[j].replier, {
              firstName: 1,
              lastName: 1,
              profileImage: 1,
              google: 1,
              googleImage: 1,
            })
            .lean();
          if (replier) {
            let isLiked = false;
            for (
              let n = 0;
              n < pin.comments[i].replies[j].likes.likers.length;
              n++
            ) {
              if (
                String(userId) ==
                String(pin.comments[i].replies[j].likes.likers[n])
              ) {
                isLiked = true;
              }
            }
            let reply = {
              id: pin.comments[i].replies[j]._id,
              replier: pin.comments[i].replies[j].replier,
              replierName: replier.firstName + ' ' + replier.lastName,
              replierImage: replier.profileImage,
              replyText: pin.comments[i].replies[j].reply,
              google: replier.google,
              googleImage: replier.googleImage,
              date: await this.HelpersUtils.dateSince(
                pin.comments[i].replies[j].date,
              ),
              likes: pin.comments[i].replies[j].likes,
              isLiked: isLiked,
            };
            replies.push(reply);
          }
        }
        retComments.push({ comment: comment, replies: replies });
      }
    }
    return retComments;
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description create new react on a pin or remove an existed react
   * @param {string} pinId - the id of the pin
   * @param {string} reactType - the react type (Wow-Love-Good idea-Thanks-Haha-none)
   * @param {string} userId - the id of the user
   * @returns  {Promise<boolean>}
   */
  async createReact(pinId, reactType, userId): Promise<boolean> {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    if (
      String(reactType) != 'Wow' &&
      String(reactType) != 'Love' &&
      String(reactType) != 'Good idea' &&
      String(reactType) != 'Thanks' &&
      String(reactType) != 'Haha' &&
      String(reactType) != 'none'
    ) {
      throw new BadRequestException('not valid reactType');
    }
    let user = await this.userModel.findById(userId, {
      profileImage: 1,
      firstName: 1,
      lastName: 1,
      google: 1,
      googleImage: 1,
    });
    let pin = await this.pinModel.findById(pinId, {
      reacts: 1,
      counts: 1,
      title: 1,
      imageId: 1,
      creator: 1,
    });
    let pinOwner = await this.userModel.findById(pin.creator.id, {
      notifications: 1,
      offlineNotifications: 1,
      fcmToken: 1,
      notificationCounter: 1,
      pinsNotification: 1,
    });
    var lastReactType = 'none';
    if (!user || !pin) throw new NotFoundException();
    let found = false;
    for (let i = 0; i < pin.reacts.length; i++) {
      if (String(pin.reacts[i].userId) == String(userId)) {
        lastReactType = String(pin.reacts[i].reactType);
        if (reactType != pin.reacts[i].reactType) {
          switch (pin.reacts[i].reactType) {
            case 'Wow':
              pin.counts.wowReacts = pin.counts.wowReacts.valueOf() - 1;
              break;
            case 'Love':
              pin.counts.loveReacts = pin.counts.loveReacts.valueOf() - 1;
              break;
            case 'Haha':
              pin.counts.hahaReacts = pin.counts.hahaReacts.valueOf() - 1;
              break;
            case 'Thanks':
              pin.counts.thanksReacts = pin.counts.thanksReacts.valueOf() - 1;
              break;
            case 'Good idea':
              pin.counts.goodIdeaReacts =
                pin.counts.goodIdeaReacts.valueOf() - 1;
              break;
          }
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
              pin.counts.goodIdeaReacts =
                pin.counts.goodIdeaReacts.valueOf() + 1;
              break;
          }
        }
        if (reactType == 'none') {
          pin.reacts.splice(i, 1);
        } else {
          pin.reacts[i].reactType = reactType;
        }
        await pin.save();
        found = true;
        break;
      }
    }
    if (!found && reactType != 'none') {
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
    }
    if (
      (!pinOwner.pinsNotification || pinOwner.pinsNotification == true) &&
      reactType != 'none'
    )
      await this.NotificationService.reactPin(
        pinOwner,
        user,
        pin.title,
        pinId,
        String(reactType),
        pin.imageId,
      );
    if (lastReactType != 'none')
      await this.NotificationService.unreactPin(
        pinOwner,
        user,
        pin.title,
        pinId,
        String(lastReactType),
        pin.imageId,
      );
    return true;
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description create new like on a comment or remove an existed like
   * @param {string} pinId - the id of the pin
   * @param {string} commentId - the id of the comment
   * @param {string} userId - the id of the user
   * @returns  {Promise<boolean>}
   */
  async likeComment(pinId, commentId, userId): Promise<boolean> {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        commentId,
      ])) == 0
    ) {
      throw new BadRequestException('invalid id');
    }
    let pin = await this.pinModel.findById(pinId, { comments: 1 });
    if (!pin) throw new NotFoundException('invalid pin');
    for (let i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        if (pin.comments[i].likes.likers.includes(userId)) {
          for (let k = 0; k < pin.comments[i].likes.likers.length; k++) {
            if (String(userId) == String(pin.comments[i].likes.likers[k])) {
              pin.comments[i].likes.likers.splice(k, 1);
              pin.comments[i].likes.counts =
                pin.comments[i].likes.counts.valueOf() - 1;
              break;
            }
          }
        } else {
          pin.comments[i].likes.likers.push(userId);
          pin.comments[i].likes.counts =
            pin.comments[i].likes.counts.valueOf() + 1;
        }

        await pin.save();
        return true;
      }
    }
    throw new Error();
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description create new like on a reply on a comment or remove an existed like
   * @param {string} pinId - the id of the pin
   * @param {string} commentId - the id of the comment
   * @param {string} userId - the id of the user
   * @param {string} replyId - the id of the reply
   * @returns  {Promise<boolean>}
   */
  async likeReply(pinId, commentId, userId, replyId): Promise<boolean> {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        pinId,
        commentId,
        replyId,
      ])) == 0
    ) {
      throw new BadRequestException('not valid id');
    }
    let pin = await this.pinModel.findById(pinId, { comments: 1 });
    if (!pin) throw new NotFoundException('no such pin');
    for (let i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        for (let j = 0; j < pin.comments[i].replies.length; j++) {
          if (String(pin.comments[i].replies[j]._id) == String(replyId)) {
            if (pin.comments[i].replies[j].likes.likers.includes(userId)) {
              for (
                let k = 0;
                k < pin.comments[i].replies[j].likes.likers.length;
                k++
              ) {
                if (
                  String(userId) ==
                  String(pin.comments[i].replies[j].likes.likers[k])
                ) {
                  pin.comments[i].replies[j].likes.likers.splice(k, 1);
                  pin.comments[i].replies[j].likes.counts =
                    pin.comments[i].replies[j].likes.counts.valueOf() - 1;
                  break;
                }
              }
            } else {
              pin.comments[i].replies[j].likes.likers.push(userId);
              pin.comments[i].replies[j].likes.counts =
                pin.comments[i].replies[j].likes.counts.valueOf() + 1;
            }
            await pin.save();
            return true;
          }
        }
      }
    }
    throw new Error();
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description edit pin that user has created
   * @param {string} pinId - the id of the pin
   * @param {string} boardId - the id of the new board
   * @param {string} userId - the id of the user
   * @param {string} sectionId - the id of the new section
   * @param {string} description - the new description
   * @param {string} title - the new title
   * @param {string} link - the new destination link
   * @returns  {Promise<boolean>}
   */
  async editCreatedPin(
    pinId,
    userId,
    boardId,
    sectionId,
    description,
    title,
    link,
  ): Promise<boolean> {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.userModel.findById(userId, { pins: 1 });
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    let pin = await this.pinModel.findById(pinId, {
      creator: 1,
      title: 1,
      note: 1,
      destLink: 1,
      section: 1,
      board: 1,
    });

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
          !sectionId &&
          (await this.ValidationService.checkMongooseID([boardId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId, {
            pins: 1,
            counts: 1,
            sections: 1,
            creator: 1,
            collaborators: 1,
          });
          let oldBoard = await this.boardModel.findById(pin.board, {
            pins: 1,
            counts: 1,
            sections: 1,
            creator: 1,
            collaborators: 1,
          });
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );

          if (checkBoard) {
            board.pins.push({
              pinId: pin._id,
              topic: pin.topic,
            });
            board.counts.pins = board.counts.pins.valueOf() + 1;
            await board.save();

            if (pin.section) {
              for (let n = 0; n < oldBoard.sections.length; n++) {
                if (String(pin.section) == String(oldBoard.sections[n]._id)) {
                  for (let d = 0; d < oldBoard.sections[n].pins.length; d++) {
                    if (
                      String(pinId) ==
                      String(oldBoard.sections[n].pins[d].pinId)
                    ) {
                      oldBoard.sections[n].pins.splice(d, 1);
                      oldBoard.counts.pins = oldBoard.counts.pins.valueOf() - 1;
                      await oldBoard.save();
                      break;
                    }
                  }
                }
              }
            } else {
              for (let d = 0; d < oldBoard.pins.length; d++) {
                if (String(pinId) == String(oldBoard.pins[d].pinId)) {
                  oldBoard.pins.splice(d, 1);
                  await oldBoard.save();
                  break;
                }
              }
            }
            user.pins[i].boardId = boardId;
            pin.board = boardId;
            user.pins[i].sectionId = null;
            pin.section = null;
          }
        }
        if (
          sectionId &&
          boardId &&
          (await this.ValidationService.checkMongooseID([sectionId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId, {
            pins: 1,
            counts: 1,
            sections: 1,
            creator: 1,
            collaborators: 1,
          });
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );
          let oldBoard = await this.boardModel.findById(pin.board, {
            pins: 1,
            counts: 1,
            sections: 1,
            creator: 1,
            collaborators: 1,
          });
          let checkSection = await this.BoardService.checkBoardHasSection(
            board,
            sectionId,
          );
          if (checkBoard && checkSection) {
            for (let s = 0; s < board.sections.length; s++) {
              if (String(board.sections[s]._id) == String(sectionId)) {
                board.sections[s].pins.push({
                  pinId: pin._id,
                  topic: pin.topic,
                });
                await board.save();
                break;
              }
            }
            if (pin.section) {
              for (let n = 0; n < oldBoard.sections.length; n++) {
                if (String(pin.section) == String(oldBoard.sections[n]._id)) {
                  for (let d = 0; d < oldBoard.sections[n].pins.length; d++) {
                    if (
                      String(pinId) ==
                      String(oldBoard.sections[n].pins[d].pinId)
                    ) {
                      oldBoard.sections[n].pins.splice(d, 1);
                      oldBoard.counts.pins = oldBoard.counts.pins.valueOf() - 1;
                      await oldBoard.save();
                      break;
                    }
                  }
                }
              }
            } else {
              for (let d = 0; d < oldBoard.pins.length; d++) {
                if (String(pinId) == String(oldBoard.pins[d].pinId)) {
                  oldBoard.pins.splice(d, 1);
                  await oldBoard.save();
                  break;
                }
              }
            }
            user.pins[i].boardId = boardId;
            pin.board = boardId;
            user.pins[i].sectionId = sectionId;
            pin.section = sectionId;
          }
        }
        if (
          !boardId &&
          sectionId &&
          (await this.ValidationService.checkMongooseID([sectionId])) != 0
        ) {
          let board = await this.boardModel.findById(pin.board, {
            pins: 1,
            counts: 1,
            sections: 1,
            creator: 1,
            collaborators: 1,
          });
          let checkSection = await this.BoardService.checkBoardHasSection(
            board,
            sectionId,
          );
          if (checkSection) {
            for (let s = 0; s < board.sections.length; s++) {
              if (String(board.sections[s]._id) == String(sectionId)) {
                board.sections[s].pins.push({
                  pinId: pin._id,
                  topic: pin.topic,
                });
                await board.save();
                break;
              }
            }
            if (pin.section) {
              for (let n = 0; n < board.sections.length; n++) {
                if (String(pin.section) == String(board.sections[n]._id)) {
                  for (let d = 0; d < board.sections[n].pins.length; d++) {
                    if (
                      String(pinId) == String(board.sections[n].pins[d].pinId)
                    ) {
                      board.sections[n].pins.splice(d, 1);
                      await board.save();
                      break;
                    }
                  }
                }
              }
            } else {
              for (let d = 0; d < board.pins.length; d++) {
                if (String(pinId) == String(board.pins[d].pinId)) {
                  board.pins.splice(d, 1);
                  await board.save();
                  break;
                }
              }
            }
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
    return true;
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description edit pin that user has saved
   * @param {string} pinId - the id of the pin
   * @param {string} boardId - the id of the new board
   * @param {string} userId - the id of the user
   * @param {string} sectionId - the id of the new section
   * @param {string} note - the new note
   * @returns  {Promise<boolean>}
   */
  async editSavedPin(
    pinId,
    userId,
    boardId,
    sectionId,
    note,
  ): Promise<boolean> {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.userModel.findById(userId, { savedPins: 1 });
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    let pin = await this.pinModel.findById(pinId, { topic: 1 });
    if (!pin) {
      throw new BadRequestException('not valid pin');
    }

    for (let i = 0; i < user.savedPins.length; i++) {
      if (String(user.savedPins[i].pinId) == String(pinId)) {
        if (
          boardId &&
          !sectionId &&
          (await this.ValidationService.checkMongooseID([boardId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId, {
            pins: 1,
            counts: 1,
            sections: 1,
            creator: 1,
            collaborators: 1,
          });
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );
          let oldBoard = await this.boardModel.findById(
            user.savedPins[i].boardId,
            {
              pins: 1,
              counts: 1,
              sections: 1,
              creator: 1,
              collaborators: 1,
            },
          );
          if (checkBoard) {
            board.pins.push({
              pinId: pin._id,
              topic: pin.topic,
            });
            board.counts.pins = board.counts.pins.valueOf() + 1;
            await board.save();
            if (user.savedPins[i].sectionId) {
              for (let n = 0; n < oldBoard.sections.length; n++) {
                if (
                  String(user.savedPins[i].sectionId) ==
                  String(oldBoard.sections[n]._id)
                ) {
                  for (let d = 0; d < oldBoard.sections[n].pins.length; d++) {
                    if (
                      String(pinId) ==
                      String(oldBoard.sections[n].pins[d].pinId)
                    ) {
                      oldBoard.sections[n].pins.splice(d, 1);
                      await oldBoard.save();
                      break;
                    }
                  }
                }
              }
            } else {
              for (let d = 0; d < oldBoard.pins.length; d++) {
                if (String(pinId) == String(oldBoard.pins[d].pinId)) {
                  oldBoard.pins.splice(d, 1);
                  await oldBoard.save();
                  break;
                }
              }
            }
            user.savedPins[i].boardId = boardId;
            user.savedPins[i].sectionId = null;
          }
        }
        if (
          sectionId &&
          boardId &&
          (await this.ValidationService.checkMongooseID([sectionId])) != 0
        ) {
          let board = await this.boardModel.findById(boardId, {
            pins: 1,
            counts: 1,
            sections: 1,
            creator: 1,
            collaborators: 1,
          });
          let oldBoard = await this.boardModel.findById(
            user.savedPins[i].boardId,
            {
              pins: 1,
              counts: 1,
              sections: 1,
              creator: 1,
              collaborators: 1,
            },
          );
          let checkBoard = await this.BoardService.authorizedBoard(
            board,
            userId,
          );
          let checkSection = await this.BoardService.checkBoardHasSection(
            board,
            sectionId,
          );
          if (checkBoard && checkSection) {
            for (let s = 0; s < board.sections.length; s++) {
              if (String(board.sections[s]._id) == String(sectionId)) {
                board.sections[s].pins.push({
                  pinId: pin._id,
                  topic: pin.topic,
                });
                await board.save();
                break;
              }
            }
            if (user.savedPins[i].sectionId) {
              for (let n = 0; n < oldBoard.sections.length; n++) {
                if (
                  String(user.savedPins[i].sectionId) ==
                  String(oldBoard.sections[n]._id)
                ) {
                  for (let d = 0; d < oldBoard.sections[n].pins.length; d++) {
                    if (
                      String(pinId) ==
                      String(oldBoard.sections[n].pins[d].pinId)
                    ) {
                      oldBoard.sections[n].pins.splice(d, 1);
                      await oldBoard.save();
                      break;
                    }
                  }
                }
              }
            } else {
              for (let d = 0; d < oldBoard.pins.length; d++) {
                if (String(pinId) == String(oldBoard.pins[d].pinId)) {
                  oldBoard.pins.splice(d, 1);
                  await oldBoard.save();
                  break;
                }
              }
            }
            user.savedPins[i].boardId = boardId;
            user.savedPins[i].sectionId = sectionId;
          }
        }
        if (
          !boardId &&
          sectionId &&
          (await this.ValidationService.checkMongooseID([sectionId])) != 0
        ) {
          let board = await this.boardModel.findById(
            user.savedPins[i].boardId,
            {
              pins: 1,
              counts: 1,
              sections: 1,
              creator: 1,
              collaborators: 1,
            },
          );
          let checkSection = await this.BoardService.checkBoardHasSection(
            board,
            sectionId,
          );
          if (checkSection) {
            for (let s = 0; s < board.sections.length; s++) {
              if (String(board.sections[s]._id) == String(sectionId)) {
                board.sections[s].pins.push({
                  pinId: pin._id,
                  topic: pin.topic,
                });
                await board.save();
                break;
              }
            }
            if (user.savedPins[i].sectionId) {
              for (let n = 0; n < board.sections.length; n++) {
                if (
                  String(user.savedPins[i].sectionId) ==
                  String(board.sections[n]._id)
                ) {
                  for (let d = 0; d < board.sections[n].pins.length; d++) {
                    if (
                      String(pinId) == String(board.sections[n].pins[d].pinId)
                    ) {
                      board.sections[n].pins.splice(d, 1);
                      await board.save();
                      break;
                    }
                  }
                }
              }
            } else {
              for (let d = 0; d < board.pins.length; d++) {
                if (String(pinId) == String(board.pins[d].pinId)) {
                  board.pins.splice(d, 1);
                  await board.save();
                  break;
                }
              }
            }
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

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description get followings pins
   * @param {String} userId  - user id
   * @returns {Array<Object>} fololowng user with there pins
   */
  async getFollowingPins(userId) {
    const user = await this.userModel
      .findOne({ _id: userId }, { following: 1 })
      .lean();
    let pins = [];
    let limitOfPinsForUser = user.following.length;
    limitOfPinsForUser = limitOfPinsForUser > 1 ? limitOfPinsForUser : 1;
    for (let i = user.following.length - 1; i >= 0; i--) {
      let followedUser = await this.userModel
        .findOne(
          { _id: user.following[i] },
          {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profileImage: 1,
            google: 1,
            googleImage: 1,
            pins: 1,
          },
        )
        .lean();
      if (!followedUser) continue;
      if (limitOfPinsForUser > followedUser.pins.length)
        limitOfPinsForUser = followedUser.pins.length;
      for (
        var j = followedUser.pins.length - 1;
        j >= followedUser.pins.length - limitOfPinsForUser;
        j--
      ) {
        let pinFound = await this.pinModel.findById(
          followedUser.pins[j].pinId,
          {
            _id: 1,
            imageId: 1,
            imageWidth: 1,
            imageHeight: 1,
            title: 1,
            topic: 1,
          },
        );
        if (pinFound)
          pins.push({
            _id: pinFound._id,
            imageId: pinFound.imageId,
            imageWidth: pinFound.imageWidth,
            imageHeight: pinFound.imageHeight,
            title: pinFound.title,
            topic: pinFound.topic,
            owner: {
              _id: followedUser._id,
              firstName: followedUser.firstName,
              lastName: followedUser.lastName,
              profileImage: followedUser.profileImage,
              google: followedUser.google,
              googleImage: followedUser.googleImage,
            },
          });
      }
    }
    return pins;
  }
  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description report a pin by a user
   * @param {string} pinId - the id of the pin
   * @param {string} userId - the id of the user
   * @param {string} reason - reason why the pin has been reported
   * @returns  {Promise<boolean>}
   */
  async reportPin(userId, pinId, reason): Promise<boolean> {
    if ((await this.ValidationService.checkMongooseID([pinId, userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    let user = await this.userModel.findById(userId, { userName: 1, email: 1 });
    if (!user) {
      throw new BadRequestException('not valid user');
    }
    await this.EmailService.sendEmail(
      process.env.EMAIL,
      {
        pinId: pinId,
        userId: userId,
        userName: user.userName,
        email: user.email,
        reason: reason,
      },
      'report',
      '',
    );
    return true;
  }
}
