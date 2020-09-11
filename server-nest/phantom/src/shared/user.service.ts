import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { sign } from 'jsonwebtoken';
import { user } from '../types/user';
import { Email } from '../shared/send-email.service';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateDto } from '../user/dto/update-user.dto';
import { Payload } from '../types/payload';
import * as Joi from '@hapi/joi';
import * as bcrypt from 'bcrypt';
import { NotificationService } from '../notification/notification.service';
import { ValidationService } from './validation.service';
import { topic } from '../types/topic';
import { use } from 'passport';
import { POINT_CONVERSION_UNCOMPRESSED } from 'constants';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<user>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    private notification: NotificationService,
    private email: Email,
    private ValidationService: ValidationService,
  ) {}
  async getUserById(id) {
    const user = await this.userModel.findById(id);
    if (!user)
      new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    if (!user.about) user.about = '';
    return user;
  }
  async getUserMe(id) {
    const user = await this.userModel
      .findById(id, {
        email: 1,
        gender: 1,
        country: 1,
        firstName: 1,
        lastName: 1,
        location: 1,
        imageId: 1,
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
        ProfileImage: 1,
        followers: 1,
      })
      .lean();
    if (!user)
      new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    if (!user.about) user.about = '';

    return user;
  }
  async getActivateUserById(id) {
    const user = await this.userModel.findById(id);
    if (!user)
      new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    if (user.activateaccount == false)
      new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    if (!user.about) user.about = '';
    return user;
  }

  async findByLogin(loginDto: LoginDto): Promise<any> {
    console.log(loginDto.password);
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .exec()
      .then(async user => {
        return user ? user : 0;
      });
    if (!user)
      throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
    if (await bcrypt.compare(loginDto.password, user.password)) {
      return user;
    }
    throw new HttpException('password is not correct', HttpStatus.FORBIDDEN);
  }
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

  async updateFCMTocken(fcmToken, userId) {
    const user = await this.getUserById(userId);
    await this.userModel.update({ _id: userId }, { fcmToken: fcmToken });
    if (fcmToken && fcmToken != ' ')
      await this.notification.sendOfflineNotification(
        user.offlineNotifications,
        user.fcmToken,
      );

    return 1;
  }

  async followingTopics(userId) {
    const user = await this.getUserById(userId);

    return user.followingTopics;
  }

  async createUser(registerDto: RegisterDto): Promise<any> {
    await this.checkCreateData(registerDto);

    let hash,
      picture = '';
    if (registerDto.isGoogle) {
      hash = '';
      picture = registerDto.profileImage;
    } else {
      const salt = await bcrypt.genSalt(10);
      hash = await bcrypt.hash(registerDto.password, salt);
    }
    var newUser = new this.userModel({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      location: '',
      notificationCounter: 0,
      profileImage: picture,
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
    await this.userModel.updateOne(
      { _id: newUser._id },
      { profileImage: newUser._id },
    );
    newUser = await this.getUserById(newUser._id);
    let topics = await this.topicModel.find({});
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
    return newUser;
  }

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
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async resetPassword(userId, newPassword, oldPassword) {
    const user = await this.getUserById(userId);
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
   * update information in user profile
   * @param {String} userId -id of user
   */

  async updateUserInfo(userId, updateDto: UpdateDto) {
    // if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
    const user = await this.getUserById(userId);
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
      let profileImage = mongoose.Types.ObjectId(updateDto.profileImage);
      await this.userModel.updateOne(
        { _id: userId },
        { profileImage: profileImage },
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
  async updateSettings(
    userId,
    settings: {
      facebook?: Boolean;
      activity?: Boolean;
      invitation?: Boolean;
      boardUpdate?: Boolean;
      google?: Boolean;
      deleteflag?: Boolean;
      boardsForYou?: Boolean;
      popularPins?: Boolean;
      pinsForYou?: Boolean;
      pinsInspired?: Boolean;
      activateaccount?: Boolean;
      followNotification?: Boolean;
      pinsNotification?: Boolean;
    },
  ) {
    /*
    settings = {
      facebook: false,
      activity: false,
      invitation: true,
      boardUpdate: true,
      google: false,
      boardsForYou: true,
      popularPins: true,
      pinsForYou: true,
      pinsInspired: true,
      activateaccount: false,
      followNotification: true,
      pinsNotification: true
    }
    const users = await this.userModel.find({});
    for (let i = 0; i < users.length; i++) {
      await this.userModel.update({ _id: users[i]._id }, {
        facebook: false,
        activity: false,
        invitation: true,
        boardUpdate: true,
        google: false,
        boardsForYou: true,
        popularPins: true,
        pinsForYou: true,
        pinsInspired: true,
        activateaccount: false,
        followNotification: true,
        pinsNotification: true
      });
    }*/
    const user = await this.getUserById(userId);
    if (settings.deleteflag) {
      for (let i = 0; i < user.followers.length; i++) {
        await this.unfollowUser(user.followers[i], user._id);
      }
      for (let i = 0; i < user.following.length; i++) {
        await this.unfollowUser(user._id, user.followers[i]);
      }
      return await this.deleteUser(userId);
    }
    await this.userModel.updateOne({ _id: userId }, settings);
    /*if(settings.facebook)
    login with facebook
    else if(settings.google)
    login with google
     */
    return 1;
  }

  /**
   * set user email
   * @param {string} userId - id of user
   * @param {string} newEmail  - new email
   * @returns {Number}
   */
  async setEmail(userId, newEmail) {
    // if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
    const user = await this.getUserById(userId);
    if (!user || !newEmail) return 0;
    await this.userModel.updateOne({ _id: userId }, { email: newEmail });
    return 1;
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    // delete following
    //delete followers
    // delete pins saved created
    await this.userModel.findByIdAndDelete(id);
    await this.email.sendEmail(
      user.email,
      undefined,
      'Delete account',
      user.firstName,
    );
  }
  async setViewState(userId, viewState) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('user not found');
    if (viewState != 'Default' && viewState != 'Compact') {
      throw new BadRequestException(
        "view state must be 'Default' or 'Compact' only",
      );
    }
    user.viewState = viewState;
    await user.save();
    return viewState;
  }
  async getViewState(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('user not found');
    if (!user.viewState) {
      user.viewState = 'Default';
      await user.save();
    }
    if (user.viewState) return user.viewState;
    return false;
  }
  /**
   * check if this user follow this user id
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
   * followUser:  make frist user id follow second user id
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
    let userFollow = await this.getUserById(followerId);
    let followedUser = await this.getActivateUserById(followingId);
    if (!userFollow || !followedUser)
      throw new BadRequestException('one of users not correct');
    if (await this.checkFollowUser(userFollow, followingId))
      throw new BadRequestException('you followed this user before');
    userFollow.following.push(followingId);
    await this.userModel.updateOne(
      { _id: userFollow._id },
      { following: userFollow.following },
    );
    if (!followedUser.followers) followedUser.followers = [];
    followedUser.followers.push(followerId);
    await followedUser.save();
    if (
      !followedUser.followNotification ||
      followedUser.followNotification == true
    )
      await this.notification.followUser(followedUser, userFollow);
    return 1;
  }

  /**
   * unfollowUser:  make frist user id unfollow second user id
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
    let userFollow = await this.getUserById(followerId);
    let followedUser = await this.getActivateUserById(followingId);
    if (!userFollow || !followedUser)
      throw new BadRequestException('one of users not correct');
    if (!(await this.checkFollowUser(userFollow, followingId)))
      throw new BadRequestException('you did not follow this user before');
    if (userFollow.following) {
      for (let i = 0; i < userFollow.following.length; i++) {
        if (String(userFollow.following[i]) === String(followingId)) {
          userFollow.following.splice(i, 1);
          await this.userModel.updateOne(
            { _id: userFollow._id },
            { following: userFollow.following },
          );
          break;
        }
      }
    } else throw new BadRequestException('you did not follow this user before');
    if (followedUser.followers) {
      for (let i = 0; i < followedUser.followers.length; i++) {
        if (String(followedUser.followers[i]) === String(followerId)) {
          followedUser.followers.splice(i, 1);
          await this.userModel.updateOne(
            { _id: followedUser._id },
            { followers: followedUser.followers },
          );
          return 1;
        }
      }
    }
    throw new BadRequestException('you did not follow this user before');
  }
  /**
   * userFollowers: get user followers
   * @param {string} userId - user id
   * @param {Number} limit  - the limit
   * @param {Number} offset - the start
   * @returns {object} - has array of user object and real number of followers
   */

  async userFollowers(userId, limit, offset) {
    if ((await this.ValidationService.checkMongooseID([userId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.getUserById(userId);
    if (!user) throw new HttpException('not user ', HttpStatus.FORBIDDEN);
    if (!user.followers || user.followers.length == 0)
      return { followers: [], numOfFollowers: 0 };
    const followers = this.ValidationService.limitOffset(
      limit,
      offset,
      user.followers,
    );
    var followersInfo = [];
    for (let i = 0; i < followers.length; i++) {
      var currentUser = await this.getUserById(followers[i]);
      if (currentUser && currentUser.activateaccount != false)
        followersInfo.push({
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          profileImage: currentUser.profileImage,
        });
    }
    return { followers: followersInfo, numOfFollowers: user.followers.length };
  }

  /**
   * userFollowings: get user following
   * @param {string} userId - user id
   * @param {Number} limit  - the limit
   * @param {Number} offset - the start
   * @returns {object} - has array of user object and real number of followings
   */
  async userFollowings(userId, limit, offset) {
    if ((await this.ValidationService.checkMongooseID([userId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.userModel.findById(userId, { following: 1 });
    if (!user) throw new HttpException('not user ', HttpStatus.FORBIDDEN);
    if (!user.following || user.following.length == 0)
      return { followings: [], numOfFollowings: 0 };
    const followings = this.ValidationService.limitOffset(
      limit,
      offset,
      user.following,
    );
    let followingsInfo = [];
    for (let i = 0; i < followings.length; i++) {
      let currentUser = await this.userModel.findById(followings[i], {
        activateaccount: 1,
        firstName: 1,
        lastName: 1,
        profileImage: 1,
      });
      if (currentUser && currentUser.activateaccount != false)
        followingsInfo.push({
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          profileImage: currentUser.profileImage,
        });
    }
    return {
      followings: followingsInfo,
      numOfFollowings: user.following.length,
    };
  }
  async followTopic(userId, topicId) {
    if ((await this.ValidationService.checkMongooseID([userId, topicId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.getUserById(userId);
    if (!user) throw new HttpException('not user ', HttpStatus.FORBIDDEN);
    console.log(user.followingTopics);
    if (!user.followingTopics) user.followingTopics = [];
    user.followingTopics.push(topicId);
    console.log(user.followingTopics);
    await this.userModel.updateOne(
      { _id: userId },
      { followingTopics: user.followingTopics },
    );
    console.log(user.followingTopics);
    const UserTest = await this.getUserById(userId);
    console.log(UserTest.followingTopics);
    return 1;
  }
  async isFollowingTopic(userId, topicId) {
    if ((await this.ValidationService.checkMongooseID([userId, topicId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.getUserById(userId);
    const topic = await this.topicModel.findById(topicId);
    if (!user || !topic)
      throw new HttpException('not user or not topic ', HttpStatus.FORBIDDEN);
    if (!user.followingTopics) return false;

    for (let i = 0; i < user.followingTopics.length; i++) {
      if (String(user.followingTopics[i]) == String(topicId)) {
        return true;
      }
    }
    return false;
  }
  async unfollowTopic(userId, topicName) {
    if ((await this.ValidationService.checkMongooseID([userId])) === 0)
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.getUserById(userId);
    if (!user) throw new HttpException('not user ', HttpStatus.FORBIDDEN);
    if (user.followingTopics) {
      for (let i = 0; i < user.followingTopics.length; i++) {
        //  console.log(user.followingTopics[i])
        //console.log(topicId);
        if (String(user.followingTopics[i]) == String(topicName)) {
          user.followingTopics.splice(i, 1);
          await this.userModel.updateOne(
            { _id: userId },
            { followingTopics: user.followingTopics },
          );
          return 1;
        }
      }
    }
    throw new BadRequestException('you did not follow this topic before');
  }
  async userSeeds() {
    var userObjects = [
      {
        firstName: 'Aya',
        password: '12345678',
        birthday: '2000-02-20',
        lastName: 'Samir',
        email: 'aya.abohadima00@eng-st.cu.edu.eg',
      },
      {
        firstName: 'Aya',
        password: '12345678',
        birthday: '2000-02-20',
        lastName: 'Samir',
        email: 'ayasabohadima@gmail.com',
      },
      {
        firstName: 'Nada',
        password: '12345678',
        birthday: '2000-02-22',
        lastName: 'Abdelmaboud',
        email: 'knada7161@gmail.com',
      },
      {
        firstName: 'Nada',
        password: '12345678',
        birthday: '2000-02-22',
        lastName: 'Abdelmaboud',
        email: 'nadaabdelmaboud50@gmail.com',
      },
      {
        firstName: 'Nada',
        password: '12345678',
        birthday: '2000-02-22',
        lastName: 'Abdelmaboud',
        email: 'nada.abdelmaboud00@eng-st.cu.edu.eg',
      },
      {
        firstName: 'Mena',
        password: '12345678',
        birthday: '1999-02-20',
        lastName: 'mahmoud',
        email: 'menna123mahmoud@gmail.com',
      },
      {
        firstName: 'Dina',
        password: '12345678',
        birthday: '1999-02-20',
        lastName: 'Alaa',
        email: 'dinaalaaahmed@gmail.com',
      },
      {
        firstName: 'Eman',
        password: '12345678',
        birthday: '2000-02-21',
        lastName: 'Othman',
        email: 'eothman21@gmail.com',
      },
      {
        firstName: 'Nihal',
        password: '12345678',
        birthday: '1999-05-17',
        lastName: 'Mansour',
        email: 'nihalmansour0599@gmail.com',
      },
      {
        firstName: 'test',
        password: '12345678',
        birthday: '1999-02-20',
        lastName: '1',
        email: 'test1@gmail.com',
      },
      {
        firstName: 'test',
        password: '12345678',
        birthday: '1999-02-20',
        lastName: '2',
        email: 'test2@gmail.com',
      },
      {
        firstName: 'test',
        password: '12345678',
        birthday: '1995-02-20',
        lastName: '3',
        email: 'test3@gmail.com',
      },
      {
        firstName: 'test',
        password: '12345678',
        birthday: '1995-02-20',
        lastName: '4',
        email: 'test4@gmail.com',
      },
      {
        firstName: 'test',
        password: '12345678',
        birthday: '1995-06-20',
        lastName: '5',
        email: 'test5@gmail.com',
      },
      {
        firstName: 'test',
        password: '12345678',
        birthday: '1995-02-10',
        lastName: '6',
        email: 'test6@gmail.com',
      },
    ];
    for (let i = 0; i < userObjects.length; i++) {
      await this.createUser(userObjects[i]);
    }
  }
}
