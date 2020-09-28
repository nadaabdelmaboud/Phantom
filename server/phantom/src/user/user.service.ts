import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
  NotAcceptableException,
  UnauthorizedException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { sign } from 'jsonwebtoken';
import { user } from '../types/user';
import { chat } from '../types/chat';
import { board } from '../types/board';
import { Email } from '../shared/send-email.service';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateDto } from './dto/update-user.dto';
import { UpdateSettingsDto } from './dto/update-user-settings.dto';
import { BoardService } from '../board/board.service';
import * as Joi from '@hapi/joi';
import * as bcrypt from 'bcrypt';
import { NotificationService } from '../shared/notification.service';
import { ValidationService } from '../shared/validation.service';
import { topic } from '../types/topic';
import { pin } from '../types/pin';
/**
 * @module Users
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<user>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Chat') private readonly chatModel: Model<chat>,
    private notification: NotificationService,
    private email: Email,
    private ValidationService: ValidationService,
    private boardService: BoardService,
  ) { }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description get user by id
   * @param {string} id - user id wanted to get
   * @returns {object<User>}
   */
  async getUserById(id) {
    const user = await this.userModel.findById(id);
    if (!user)
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    if (!user.about) user.about = '';
    return user;
  }

  /**
   *  @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description Sget user by id  with profile data
   * @param {string} id - user id wanted to get
   * @returns {object<User>}
   */
  async getUserMe(id) {
    let userId = mongoose.Types.ObjectId(id);
    let user = await this.userModel.aggregate([
      { $match: { _id: userId } },
      {
        $project: {
          followers: { $size: '$followers' },
          email: 1,
          gender: 1,
          country: 1,
          firstName: 1,
          lastName: 1,
          location: 1,
          activity: 1,
          pinsForYou: 1,
          pinsInspired: 1,
          popularPins: 1,
          boardsForYou: 1,
          boardUpdate: 1,
          invitation: 1,
          pinsNotification: 1,
          followNotification: 1,
          userName: 1,
          sortType: 1,
          profileImage: 1,
          google: 1,
          googleImage: 1,
          about: 1
        },
      },
    ]);
    if (!user)
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    if (!user[0].about) user[0].about = '';
    return user[0];
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get notification data from user
   * @param {string} id - user id wanted to get
   * @returns {object}
   */
  async getUserNotifications(userId) {
    let user = await this.userModel.findById(userId, {
      notifications: 1,
      notificationCounter: 1,
    });
    let offset: number =
      user.notifications.length > 30 ? user.notifications.length - 30 : 0;
    let limit: number =
      user.notifications.length > 30 ? offset + 30 : user.notifications.length;
    let ret = {
      notificationCounter: user.notificationCounter,
      notifications: user.notifications.slice(offset, limit),
    };
    return ret;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description get user by findData and get only from user data
   * @param {Object} findData - user data wanted to get
   * @param {Object} data - data should get
   * @returns {Object}
   */
  async findUserAndGetData(findData: {}, data: {}) {
    let user = await this.userModel.findOne(findData, data)
    if (!user)
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    if (!user.about) {
      user.about = '';
      await user.save()
    }
    return user;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description get user by login
   * @param {LoginDto} loginDto - email of user & password
   * @returns {object} object of _id :id of user , profileImage : user image & email :user email
   */
  async findByLogin(loginDto: LoginDto) {
    const user = await this.findUserAndGetData(
      { email: loginDto.email },
      { password: 1, profileImage: 1, email: 1, _id: 1 },
    ).catch(err => {
      console.log(err);
    });
    if (!user)
      throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
    if (await bcrypt.compare(loginDto.password, user.password)) {
      return user;
    }
    throw new HttpException('password is not correct', HttpStatus.FORBIDDEN);
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description check data after create user
   * @param {RegisterDto} registerDto - data of created user
   */
  async checkCreateData(registerDto: RegisterDto) {
    const shcema = Joi.object({
      email: Joi.string()
        .trim()
        .email()
        .required(),
      password: Joi.string().required(),
      birthday: Joi.date()
        .raw()
        .required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      country: Joi.string().optional(),
      gender: Joi.string().optional(),
      bio: Joi.string().optional(),
      iat: Joi.optional(),
      exp: Joi.optional(),
    });
    const body = registerDto;
    const validate = shcema.validate(body);
    if (validate.error)
      throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
    if (await this.checkMAilExistAndFormat(registerDto.email))
      throw new HttpException(
        '"email" should not have acount',
        HttpStatus.FORBIDDEN,
      );
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description check update data after update
   * @param {UpdateDto} updateDto - data need to update
   */
  async checkUpdateData(updateDto: UpdateDto) {
    const shcema = Joi.object({
      email: Joi.string()
        .trim()
        .email()
        .optional(),
      password: Joi.string().optional(),
      birthDate: Joi.date()
        .raw()
        .optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      country: Joi.string().optional(),
      location: Joi.string().optional(),
      userName: Joi.string().optional(),
      gender: Joi.string().optional(),
      bio: Joi.string().optional(),
      iat: Joi.optional(),
      exp: Joi.optional(),
      profileImage: Joi.string().optional(),
    });
    const body = updateDto;
    const validate = shcema.validate(body);
    if (validate.error)
      throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
    if (updateDto.email)
      if (await this.checkMAilExistAndFormat(updateDto.email))
        throw new HttpException(
          '"email" should not have acount',
          HttpStatus.FORBIDDEN,
        );
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description update FCM token value
   * @param {String} fcmToken - token for notification
   * @param {String} userId   - id of user
   * @returns {Number} 1
   */
  async updateFCMTocken(fcmToken, userId) {
    const user = await this.findUserAndGetData(
      { _id: userId },
      { fcmToken: 1, _id: 1, email: 1 },
    );
    await this.userModel.update({ _id: userId }, { fcmToken: fcmToken });
    if (fcmToken && fcmToken != ' ')
      await this.notification.sendOfflineNotification(
        user.offlineNotifications,
        user.fcmToken,
      );
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description get user following topics
   * @param {String} userId - id of user
   * @returns {Array<String>} - following topic ids s
   */
  async followingTopics(userId) {
    const user = await this.findUserAndGetData(
      { _id: userId },
      { _id: 1, email: 1, followingTopics: 1 },
    );
    return user.followingTopics;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description create new user
   * @param {RegisterDto} registerDto -data to create user
   * @returns {Object} _id ,email and profileImage of userS
   */
  async createUser(registerDto: RegisterDto) {
    let hash,
      googleImage = null,
      picture = null;
    if (registerDto.isGoogle) {
      hash = '';
      googleImage = registerDto.profileImage;
    } else {
      await this.checkCreateData(registerDto);
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(registerDto.password, salt);
    }
    var newUser = new this.userModel({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      location: '',
      notificationCounter: 0,
      profileImage: picture,
      lastTopics: [],
      userName: registerDto.firstName + ' ' + registerDto.lastName,
      email: registerDto.email,
      password: hash,
      sortType: 'Date',
      fcmToken: ' ',
      boardsForYou: true,
      popularPins: true,
      pinsForYou: true,
      pinsInspired: true,
      activity: true,
      invitation: true,
      boardUpdate: true,
      history: [],
      facebook: false,
      googleImage: googleImage,
      google: registerDto.isGoogle ? registerDto.isGoogle : false,
      about: registerDto.bio ? registerDto.bio : '',
      gender: registerDto.gender,
      country: registerDto.country,
      birthDate: registerDto.birthday,
      activateaccount: true,
      followNotification: true,
      pinsNotification: true,
      pins: [],
      homeFeed: [],
      uploadedImages: [],
      savedImages: [],
      notifications: [],
      offlineNotifications: [],
      followers: [],
      following: [],
      followingTopics: [],
      boards: [],
      counts: {
        likes: 0,
        comments: 0,
        repins: 0,
        saves: 0,
      },
      createdAt: Date.now(),
    });
    await newUser.save();
    newUser = await this.userModel.findById(newUser._id, {
      firstName: 1,
      lastName: 1,
    });
    let topics = await this.topicModel.find(
      {},
      { name: 1, recommendedUsers: 1 },
    );
    for (let i = 0; i < topics.length; i++) {
      if (
        newUser.firstName.includes(String(topics[i].name)) ||
        newUser.lastName.includes(String(topics[i].name))
      ) {
        if (!topics[i].recommendedUsers) topics[i].recommendedUsers = [];
        if (!topics[i].recommendedUsers.includes(newUser._id)) {
          topics[i].recommendedUsers.push(newUser._id);
          await topics[i].save();
          break;
        }
      }
    }
    await this.userModel.ensureIndexes();
    return newUser;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description check email in formate and if exist
   * @param {String} email - email should check
   * @returns  {Object<User>}
   */
  async checkMAilExistAndFormat(email) {
    const body = { email: email };
    const shcema = Joi.object({
      email: Joi.string()
        .trim()
        .email()
        .required(),
    });
    const validate = shcema.validate(body);
    if (validate.error != null)
      throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
    const user = await this.userModel
      .findOne(
        { email: email },
        {
          password: 1,
          _id: 1,
          email: 1,
          fcmToken: 1,
          location: 1,
          firstName: 1,
        },
      )
      .lean();
    return user;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description change user password
   * @param {String} userId - user id
   * @param {String} newPassword - new password of user
   * @param {String} oldPassword - old password of user
   * @returns {Number} 1
   */
  async resetPassword(userId, newPassword, oldPassword) {
    const user = await this.findUserAndGetData(
      { _id: userId },
      { email: 1, password: 1, _id: 1, fristName: 1 },
    );
    if (!user || !newPassword)
      throw new HttpException('there is no new password', HttpStatus.FORBIDDEN);
    if (oldPassword) {
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new HttpException(
          'old password is not correct',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await this.userModel.updateOne({ _id: userId }, { password: hash });
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description update information in user profile
   * @param {String} userId -id of user
   * @param {UpdateDto} updateDto -update data
   * @returns {Number} 1
   */
  async updateUserInfo(userId, updateDto: UpdateDto) {
    const user = await this.getUserMe(userId);
    if (!user) return 0;
    if (updateDto.firstName)
      await this.userModel.updateOne(
        { _id: userId },
        { firstName: updateDto.firstName },
      );
    if (updateDto.lastName)
      await this.userModel.updateOne(
        { _id: userId },
        { lastName: updateDto.lastName },
      );
    if (updateDto.userName)
      await this.userModel.updateOne(
        { _id: userId },
        { userName: updateDto.userName },
      );
    if (updateDto.location)
      await this.userModel.updateOne(
        { _id: userId },
        { location: updateDto.location },
      );
    if (updateDto.bio)
      await this.userModel.updateOne({ _id: userId }, { about: updateDto.bio });
    if (updateDto.gender)
      await this.userModel.updateOne(
        { _id: userId },
        { gender: updateDto.gender },
      );
    if (updateDto.country)
      await this.userModel.updateOne(
        { _id: userId },
        { country: updateDto.country },
      );
    if (updateDto.profileImage) {
      await this.userModel.updateOne(
        { _id: userId },
        { profileImage: updateDto.profileImage },
      );
    }

    if (
      updateDto.email &&
      !(await this.checkMAilExistAndFormat(updateDto.email))
    ) {
      var token =
        'Bearer ' +
        sign(
          {
            email: user.email,
            _id: user._id,
            newEmail: updateDto.email,
            firstName: updateDto.firstName
              ? updateDto.firstName
              : user.firstName,
          },
          process.env.SECRET_KEY,
          { expiresIn: '67472347632732h' },
        );

      await this.email.sendEmail(
        user.email,
        token,
        'change email',
        updateDto.firstName ? updateDto.firstName : user.firstName,
      );
    }
    if (updateDto.birthDate)
      await this.userModel.updateOne(
        { _id: userId },
        { birthDate: updateDto.birthDate },
      );
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description update settings in user profile
   * @param {String} userId -id of user
   * @param {UpdateSettings} updateSettings - settings data should update
   * @returns {Number} 1
   */
  async updateSettings(userId, settings: UpdateSettingsDto) {
    const user = await this.getUserById(userId);
    if (settings.deleteFlag) {
      await this.deleteAllFollowers(userId);
      await this.deleteAllFollowings(userId);
      await this.deleteAllFollowingsTopics(userId);
      await this.deleteAllPins(userId);
      await this.deleteAllBoards(userId);
      await this.deleteAllRecomendation(userId);
      await this.deleteAllReatsAndComments(userId);
      await this.deleteUserUpdateChats(userId)
      await this.deleteUser(userId);
      return 1;
    }
    await this.userModel.updateOne({ _id: userId }, settings);
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description set user email
   * @param {string} userId - id of user
   * @param {string} newEmail  - new email
   * @returns {Number}
   */
  async setEmail(userId, newEmail) {
    const user = await this.findUserAndGetData(
      { _id: userId },
      { email: 1, _id: 1 },
    );
    if (!user || !newEmail) return 0;
    await this.userModel.updateOne({ _id: userId }, { email: newEmail });
    return 1;
  }
  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description delete user
   * @param {string} id -the id of user went to deleted
   */
  async deleteUser(id) {
    const user = await this.getUserById(id);
    await this.userModel.findByIdAndDelete(id);
    await this.email.sendEmail(
      user.email,
      null,
      'Delete account',
      user.firstName,
    );
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description set view state of user
   * @param {String} userId - the id of user
   * @param  {String} viewState  - view state 'Default' or 'Compact'
   * @returns {String} view state
   */
  async setViewState(userId, viewState) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    const user = await this.findUserAndGetData(
      { _id: userId },
      { _id: 1, email: 1, viewState: 1 },
    );
    if (!user) throw new NotFoundException('user not found');
    if (viewState != 'Default' && viewState != 'Compact') {
      throw new BadRequestException(
        "view state must be 'Default' or 'Compact' only",
      );
    }
    user.viewState = viewState;
    await this.userModel.update({ _id: userId }, { viewState: viewState });
    return viewState;
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get view state of user
   * @param {String} userId - the id of user
   * @returns {String} view state
   */
  async getViewState(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    const user = await this.findUserAndGetData(
      { _id: userId },
      { _id: 1, viewState: 1 },
    );
    if (!user) throw new NotFoundException('user not found');
    if (!user.viewState) {
      user.viewState = 'Default';
      await this.userModel.update({ _id: userId }, { viewState: 'Default' });
    }
    if (user.viewState) return user.viewState;
    return false;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description check if this user follow this user id
   * @param {Object} user - user he follow
   * @param {String} userId - id of user followed
   * @returns {boolean}
   */
  async checkFollowUser(user, userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    if (!user) throw new BadRequestException('not user');
    if (!user.following)
      await this.userModel.updateOne({ _id: user._id }, { following: [] });
    for (let i = 0; i < user.following.length; i++)
      if (String(userId) === String(user.following[i])) return true;
    return false;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description followUser:  make frist user id follow second user id
   * @param {String} followerId - id of user went to follow
   * @param {String} followingId  - id of user wented to be followed
   * @returns {Number}
   */
  async followUser(followerId, followingId) {
    if (
      (await this.ValidationService.checkMongooseID([
        followerId,
        followingId,
      ])) === 0
    )
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    if (String(followerId) == String(followingId))
      throw new HttpException(
        'You can not follow yourself ',
        HttpStatus.FORBIDDEN,
      );
    let userFollow = await this.findUserAndGetData(
      { _id: followerId },
      {
        _id: 1,
        followers: 1,
        following: 1,
        firstName: 1,
        lastName: 1,
        profileImage: 1,
        google: 1,
        googleImage: 1,
      },
    );
    let followedUser = await this.findUserAndGetData(
      { _id: followingId },
      {
        _id: 1,
        followers: 1,
        following: 1,
        firstName: 1,
        lastName: 1,
        notifications: 1,
        notificationCounter: 1,
        offlineNotifications: 1,
        profileImage: 1,
        fcmToken: 1,
        google: 1,
        googleImage: 1,
      },
    );
    if (!userFollow || !followedUser)
      throw new BadRequestException('one of users not correct');
    if (userFollow.following.includes(followingId))
      throw new BadRequestException('you followed this user before');
    userFollow.following.push(followingId);
    await this.userModel.updateOne(
      { _id: userFollow._id },
      { following: userFollow.following },
    );
    if (!followedUser.followers) followedUser.followers = [];
    followedUser.followers.push(followerId);
    await this.userModel.update(
      { _id: followingId },
      { followers: followedUser.followers },
    );
    if (
      !followedUser.followNotification ||
      followedUser.followNotification == true
    ) {
      var newUserData = await this.notification.followUser(
        followedUser,
        userFollow,
      );
      await this.updateDataInUser(followingId, newUserData);
    }
    return 1;
  }
  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description update data in user model
   * @param {String} userId - user id
   * @param {Object} data  - object of data need to update in user model
   * @returns {Number} 1
   */
  async updateDataInUser(userId, data: {}) {
    if (!(await this.findUserAndGetData({ _id: userId }, { _id: 1, email: 1 })))
      throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    await this.userModel.updateOne({ _id: userId }, data);
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description unfollowUser:  make frist user id unfollow second user id
   * @param {String} followerId - id of user went to unfollow
   * @param {String} followingId  - id of user wented to be unfollowed
   * @returns {Number}
   */

  async unfollowUser(followerId, followingId) {
    if (
      (await this.ValidationService.checkMongooseID([
        followerId,
        followingId,
      ])) === 0
    )
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    let userFollow = await this.findUserAndGetData(
      { _id: followerId },
      {
        _id: 1,
        followers: 1,
        following: 1,
        firstName: 1,
        lastName: 1,
        profileImage: 1,
        google: 1,
        googleImage: 1,
      },
    );
    let followedUser = await this.findUserAndGetData(
      { _id: followingId },
      {
        _id: 1,
        followers: 1,
        following: 1,
        notifications: 1,
        firstName: 1,
        lastName: 1,
        notificationCounter: 1,
        offlineNotifications: 1,
        fcmToken: 1,
        profileImage: 1,
        google: 1,
        googleImage: 1,
      },
    );
    if (!userFollow || !followedUser)
      throw new BadRequestException('one of users not correct');
    if (!userFollow.following.includes(followingId))
      throw new BadRequestException('you did not follow this user before');
    if (userFollow.following) {
      await this.userModel
        .findByIdAndUpdate(followerId, { $pull: { following: followingId } })
        .lean();
    } else throw new BadRequestException('you did not follow this user before');
    if (followedUser.followers) {
      await this.userModel
        .findByIdAndUpdate(followingId, { $pull: { followers: followerId } })
        .lean();
      var newUserData = await this.notification.unfollowUser(
        followedUser,
        userFollow,
      );
      await this.updateDataInUser(followingId, newUserData);
      return 1;
    }
    throw new BadRequestException('you did not follow this user before');
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description userFollowers: get user followers
   * @param {string} userId - user id
   * @param {Number} limit  - the limit
   * @param {Number} offset - the start
   * @returns {object} - has array of user object and real number of followers
   */

  async userFollowers(userId, limit, offset) {
    if ((await this.ValidationService.checkMongooseID([userId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.findUserAndGetData(
      { _id: userId },
      { following: 1, _id: 1, followers: 1 },
    );
    if (!user) throw new HttpException('not user ', HttpStatus.FORBIDDEN);
    if (!user.followers || user.followers.length == 0)
      return { followers: [], numOfFollowers: 0 };
    if (!limit || limit > user.followers.length) limit = user.followers.length;
    if (!offset || offset > user.followers.length) offset = 0;
    if (offset + limit > user.followers.length) limit = user.followers.length - offset;
    const followers = user.followers.slice(offset, offset + limit);
    var followersInfo = [];
    for (let i = 0; i < followers.length; i++) {
      var currentUser = await this.findUserAndGetData(
        { _id: followers[i] },
        {
          _id: 1,
          firstName: 1,
          lastName: 1,
          profileImage: 1,
          google: 1,
          googleImage: 1,
        },
      );
      console.log(currentUser);
      if (currentUser) followersInfo.push(currentUser);
    }
    return { followers: followersInfo, numOfFollowers: user.followers.length };
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description userFollowings: get user following
   * @param {string} userId - user id
   * @param {Number} limit  - the limit
   * @param {Number} offset - the start
   * @returns {object} - has array of user object and real number of followings
   */
  async userFollowings(userId, limit, offset) {
    if ((await this.ValidationService.checkMongooseID([userId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.findUserAndGetData(
      { _id: userId },
      { following: 1, _id: 1, followers: 1 },
    );
    if (!user) throw new HttpException('not user ', HttpStatus.FORBIDDEN);
    if (!user.following || user.following.length == 0)
      return { followings: [], numOfFollowings: 0 };
    if (!limit || limit > user.following.length) limit = user.following.length;
    if (!offset || offset > user.following.length) offset = 0;
    if (offset + limit > user.following.length) limit = user.following.length - offset;
    const followings = user.following.slice(offset, offset + limit);

    let followingsInfo = [];
    for (let i = 0; i < followings.length; i++) {
      var currentUser = await this.findUserAndGetData(
        { _id: followings[i] },
        {
          _id: 1,
          firstName: 1,
          lastName: 1,
          profileImage: 1,
          google: 1,
          googleImage: 1,
        },
      );
      if (currentUser) followingsInfo.push(currentUser);
    }
    return {
      followings: followingsInfo,
      numOfFollowings: user.following.length,
    };
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description to delete all followers of user
   * @param {String} userId - the id of user in mongoose formate
   * @returns {Number} "1" 
   */
  async deleteAllFollowers(userId) {
    let user = await this.findUserAndGetData({ _id: userId }, { _id: 1, followers: 1 });
    if (!user || !user.followers) return 1;
    for (let i = 0; i < user.followers.length; i++) {
      await this.unfollowUser(user.followers[i], userId);
    }
    return 1;
  }

  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description to delete all followings of user
   * @param {String} userId - the id of user in mongoose formate
   * @returns {Number} "1" 
   */
  async deleteAllFollowings(userId) {
    let user = await this.findUserAndGetData({ _id: userId }, { _id: 1, following: 1 });
    if (!user || !user.following) return 1;
    for (let i = 0; i < user.following.length; i++) {
      await this.unfollowUser(userId, user.following[i]);
    }
    return 1;
  }


  /**
  * @author Aya Abohadima <ayasabohadima@gmail.com>
  * @description make user unfollow topic
  * @param {String} userId -user id  
  * @param {String} topicId - topic id
  * @returns {Number} 1
  */
  async unfollowTopic(userId, topicId) {
    if (!this.ValidationService.checkMongooseID([userId, topicId]))
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.findUserAndGetData({ _id: userId }, { _id: 1, followingTopics: 1 });
    if (!user)
      throw new HttpException(
        'user id is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    const topic = await this.topicModel.findOne({ _id: topicId }, { _id: 1, followers: 1 });
    if (!topic)
      throw new HttpException('topic id is not correct', HttpStatus.FORBIDDEN);
    if (!topic.followers)
      throw new HttpException(
        'you dont follow this topic',
        HttpStatus.BAD_REQUEST,
      );
    if (!topic.followers.includes(userId)) throw new HttpException(
      'you dont follow this topic',
      HttpStatus.BAD_REQUEST,
    );
    await this.topicModel
      .findByIdAndUpdate(topicId, { $pull: { followers: userId } })
      .lean();
    if (!user.followingTopics)
      throw new HttpException(
        'you dont follow this topic',
        HttpStatus.BAD_REQUEST,
      );
    await this.userModel
      .findByIdAndUpdate(userId, { $pull: { followingTopics: topicId } })
      .lean();

    return 1;
  }


  /**
     * @author Aya Abohadima <ayasabohadima@gmail.com>
     * @description to unfollow all topics
     * @param {String} userId - the id of user in mongoose formate
     * @returns {Number} "1" 
     */
  async deleteAllFollowingsTopics(userId) {
    let user = await this.findUserAndGetData({ _id: userId }, { _id: 1, followingTopics: 1 });
    if (!user || !user.followingTopics) return 1;
    for (let i = 0; i < user.followingTopics.length; i++) {
      await this.unfollowTopic(userId, user.followingTopics[i]);
    }
    return 1;
  }


  /**
    * @author Aya Abohadima <ayasabohadima@gmail.com>
    * @description to remove all reacts user done 
    * @param {String} userId - the id of user in mongoose formate
    * @returns {Number} "1" 
    */
  async deleteAllReatsAndComments(userId) {
    let user = await this.findUserAndGetData({ _id: userId }, { _id: 1 });
    if (!user) return 1;
    /* await this.pinModel.update({ "reacts": { reactType: 'Wow', userId: userId } }, { $pull: { reacts: { reactType: 'Wow', userId: userId } }, $inc: { "counts.wowReacts": -1 } },
       { multi: true });
     await this.pinModel.update({ "reacts": { reactType: 'Love', userId: userId } }, { $pull: { reacts: { reactType: 'Love', userId: userId } }, $inc: { "counts.loveReacts": -1 } },
       { multi: true });
     await this.pinModel.update({ "reacts": { reactType: 'Haha', userId: userId } }, { $pull: { reacts: { reactType: 'Haha', userId: userId } }, $inc: { "counts.hahaReacts": -1 } },
       { multi: true });
     await this.pinModel.update({ "reacts": { reactType: 'Thanks', userId: userId } }, { $pull: { reacts: { reactType: 'Thanks', userId: userId } }, $inc: { "counts.thanksReacts": -1 } },
       { multi: true });
     await this.pinModel.update({ "reacts": { reactType: 'Good idea', userId: userId } }, { $pull: { reacts: { reactType: 'Good idea', userId: userId } }, $inc: { "counts.goodIdeaReacts": -1 } },
       { multi: true });*/
    let pins = await this.pinModel.find({ "reacts.userId": userId }, { _id: 1, counts: 1, reacts: 1 })
    for (let i = 0; i < pins.length; i++) {
      for (let j = 0; j < pins[i].reacts.length; j++) {
        if (String(pins[i].reacts[j].userId) == String(userId))
          if (pins[i].reacts[j].reactType == 'Wow') {
            pins[i].reacts.splice(j, 1);
            pins[i].counts.wowReacts = Number(pins[i].counts.wowReacts) - 1;
            await this.pinModel.updateOne({ _id: pins[i]._id }, { reacts: pins[i].reacts, counts: pins[i].counts })
          } else if (pins[i].reacts[j].reactType == 'Good idea') {
            pins[i].reacts.splice(j, 1);
            pins[i].counts.goodIdeaReacts = Number(pins[i].counts.goodIdeaReacts) - 1;
            await this.pinModel.updateOne({ _id: pins[i]._id }, { reacts: pins[i].reacts, counts: pins[i].counts })
          } else if (pins[i].reacts[j].reactType == 'Thanks') {
            pins[i].reacts.splice(j, 1);
            pins[i].counts.thanksReacts = Number(pins[i].counts.thanksReacts) - 1;
            await this.pinModel.updateOne({ _id: pins[i]._id }, { reacts: pins[i].reacts, counts: pins[i].counts })
          } else if (pins[i].reacts[j].reactType == 'Haha') {
            pins[i].reacts.splice(j, 1);
            pins[i].counts.hahaReacts = Number(pins[i].counts.hahaReacts) - 1;
            await this.pinModel.updateOne({ _id: pins[i]._id }, { reacts: pins[i].reacts, counts: pins[i].counts })
          } else if (pins[i].reacts[j].reactType == 'Love') {
            pins[i].reacts.splice(j, 1);
            pins[i].counts.loveReacts = Number(pins[i].counts.loveReacts) - 1;
            await this.pinModel.updateOne({ _id: pins[i]._id }, { reacts: pins[i].reacts, counts: pins[i].counts })
          }
      }

    }
    pins = await this.pinModel.find({ "comments.commenter": userId }, { _id: 1, comments: 1, counts: 1 });
    for (let i = 0; i < pins.length; i++) {
      for (let j = 0; j < pins[i].comments.length; j++) {
        if (String(pins[i].comments[j].commenter) == String(userId))
          pins[i].comments.splice(j, 1);
        pins[i].counts.comments = Number(pins[i].counts.comments) - 1;
        break;
      }
      await this.pinModel.updateOne({ _id: pins[i]._id }, { comments: pins[i].comments, counts: pins[i].counts });
    }
    return 1;
  }


  /**
     * @author Aya Abohadima <ayasabohadima@gmail.com>
     * @description delete all pins created and saved by this user
     * @param {String} userId - the id of user in mongoose formate
     * @returns {Number} "1" 
     */
  async deleteAllPins(userId) {
    const user = await this.findUserAndGetData({ _id: userId }, { _id: 1, pins: 1, savedPins: 1 });
    if (!user) return 1;
    for (let i = 0; i < user.pins.length; i++) {
      await this.boardService.deletePin(user.pins[i].pinId, userId);
    }
    for (let i = 0; i < user.savedPins.length; i++) {
      await this.boardService.unsavePin(user.savedPins[i].pinId, user.savedPins[i].boardId, user.savedPins[i].sectionId, userId, false);
    }
  }

  /**
     * @author Aya Abohadima <ayasabohadima@gmail.com>
     * @description delete all boards created 
     * @param {String} userId - the id of user in mongoose formate
     * @returns {Number} "1" 
     */
  async deleteAllBoards(userId) {
    const user = await this.findUserAndGetData({ _id: userId }, { _id: 1, boards: 1 });
    if (!user) return 1;
    for (let i = 0; i < user.boards.length; i++) {
      await this.boardService.deleteBoard(userId, user.boards[i].boardId);
    }
    let boards = await this.boardModel.find({ "collaborators.collaboratorId": userId }, { collaborators: 1, _id: 1, creator: 1 })
    for (let i = 0; i < boards.length; i++) {
      await this.boardService.deleteCollaborator(boards[i].creator.id, boards[i]._id, userId);
    }
  }
  /**
   * @author Aya Abohadima <ayasabohadima@gmail.com>
   * @description delete user from all notification
   * @param {String} userId - the id of user in mongoose formate
   * @returns {Number} "1" 
   */
  async deleteAllRecomendation(userId) {
    const topics = await this.topicModel.find({ "recommendedUsers": userId }, { _id: 1, recommendedUsers: 1 });
    for (let i = 0; i < topics.length; i++) {
      for (let j = 0; j < topics[i].recommendedUsers.length; j++) {
        if (String(topics[i].recommendedUsers[j]) == String(userId))
          topics[i].recommendedUsers.splice(j, 1);
      }
      await this.topicModel.updateOne({ _id: topics[i]._id }, { recommendedUsers: topics[i].recommendedUsers })
    }
  }

  /**
  * @author Aya Abohadima <ayasabohadima@gmail.com>
  * @description delete chat
  * @param {String} userId - the id of user in mongoose formate
  * @returns {Number} "1" 
  */
  async deleteUserUpdateChats(userId) {
    let chats = await this.chatModel.find({ "usersIds": userId }, { deletedUserIds: 1, _id: 1 });
    for (let i = 0; i < chats.length; i++) {
      chats[i].deletedUserIds.push(userId);
      await this.chatModel.updateOne({ _id: chats[i]._id }, { deletedUserIds: chats[i].deletedUserIds })
    }
  }

  /**
   * @author Nada AbdElmaboud <nada5aled52@gmail.com>
   * @description get public home for unauthorized users
   * @param {number} index - start index of topics returned
   * @returns {Array<pin>}
   */
  async getPublicHome(index: number) {
    index = Math.floor(
      Math.random() * 1000 + 1,
    );
    let pins = await this.pinModel.find({}, { imageId: 1 }).skip(Number(index)).limit(10);

    return pins;
  }
}
