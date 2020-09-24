import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { topic } from '../types/topic';
import { ValidationService } from '../shared/validation.service';
import { UserService } from '../user/user.service';
import { pin } from '../types/pin';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('User') private readonly userModel: Model<pin>,

    private UserService: UserService,
    private ValidationService: ValidationService,
  ) { }
  async topicsSeeds(topics) {
    for (var i = 0; i < topics.length; i++) {
      await this.createTopic(topics[i].imageId, '', 200, 200, topics[i].name);
    }
    return true;
  }
  async editTopic(topics) {
    for (let i = 0; i < topics.length; i++) {
      await this.topicModel
        .findOneAndUpdate(
          { name: topics[i].name },
          { imageId: topics[i].imageId },
        )
        .lean();
    }
    return 1;
  }
  async createTopic(imageId, description, imageWidth, imageHeight, name) {
    if (!this.ValidationService.checkMongooseID([imageId]))
      throw new Error('not mongoose id');
    let topicExist = await this.topicModel
      .findOne({ name: name }, '_id')
      .lean();
    if (topicExist) throw new Error('topic has been already exists');
    let topic = new this.topicModel({
      name: name,
      imageId: imageId,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      followers: [],
      description: description,
      pins: [],
    });
    await topic.save();
    return topic;
  }
  async getTopicById(topicId) {
    if (!this.ValidationService.checkMongooseID([topicId]))
      throw new Error('not mongoose id');
    const topic = await this.topicModel.findById(topicId, 'pins followers', (err, topic) => {
      if (err) throw new Error('topic not found');
      return topic;
    });
    return topic;
  }
  async getTopics(userId): Promise<any> {
    let topics = await this.topicModel.find(
      {},
      'name description imageId followers',
      (err, topic) => {
        if (err) throw new Error('topic not found');
        return topic;
      },
    );
    return topics.map(topic => {
      let isFollow = topic.followers.includes(userId);
      return {
        isFollow,
        _id: topic._id,
        name: topic.name,
        description: topic.description,
        imageId: topic.imageId,
      };
    });
  }
  async addPinToTopic(topicName, pinId): Promise<Boolean> {
    if (!this.ValidationService.checkMongooseID([pinId]))
      throw new Error('not mongoose id');
    let topic = await this.topicModel.find({ name: topicName }, 'pins');
    let id = mongoose.Types.ObjectId(pinId);
    const pin = await this.pinModel.findById(id, 'topic');
    if (!pin) throw new NotFoundException();
    pin.topic = topicName;
    await pin.save().catch(err => {
      return err;
    });
    if (topic && pin) {
      topic[0].pins.push(pinId);
      await topic[0].save().catch(err => {
        return err;
      });
      return true;
    }
    throw new NotFoundException();
  }
  async getPinsOfTopic(topicId, limit, offset, userId): Promise<pin[]> {
    if (!this.ValidationService.checkMongooseID([topicId]))
      throw new Error('not mongoose id');
    const topic = await this.getTopicById(topicId);
    if (!topic.pins.length) return [];
    let pinsIds = this.ValidationService.limitOffset(
      limit,
      offset,
      topic.pins,
    );
    let pins = [];
    for (let i = 0; i < pinsIds.length; i++) {
      await this.pinModel.findById(pinsIds[i], 'imageId', (err, pin) => {
        if (pin) pins.push(pin);
      });
    }
    return pins;
  }
  /**
   * @author Aya Abohadima
   * @descriptioncheck if this user follow this topic 
    * @param {String} userId -user id  
    * @param {String} topicId - topic id
    * @returns {Boolean}
    */
  async checkFollowTopic(userId, topicId) {
    if (!this.ValidationService.checkMongooseID([userId, topicId]))
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    if (!(await this.UserService.getUserById(userId)))
      throw new HttpException(
        'user id is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    const topic = await this.getTopicById(topicId);
    if (!topic)
      throw new HttpException('topic id is not correct', HttpStatus.FORBIDDEN);
    if (!topic.followers || topic.followers.length == 0) return false;
    return topic.followers.includes(userId);
  }

  /**
    * @author Aya Abohadima
    * @description make user follow topic
    * @param {String} userId -user id  
    * @param {String} topicId - topic id
    * @returns {Number} 1
  */
  async followTopic(userId, topicId) {
    if (!this.ValidationService.checkMongooseID([userId, topicId]))
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    if (await this.checkFollowTopic(userId, topicId))
      throw new HttpException(
        'you are already follow this topic',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.UserService.getUserById(userId);
    if (!user)
      throw new HttpException(
        'user id is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    const topic = await this.topicModel.findById(topicId, {
      pins: 1,
      followers: 1,
      name: 1,
    });
    if (!topic)
      throw new HttpException('topic id is not correct', HttpStatus.FORBIDDEN);
    if (!topic.followers) topic.followers = [];
    topic.followers.push(userId);
    await topic.save();
    if (!user.followingTopics) user.followingTopics = [];
    user.followingTopics.push(topicId);
    if (!user.lastTopics) user.lastTopics = [];
    if (user.lastTopics.length > 0) {
      if (user.lastTopics[user.lastTopics.length - 1].topicName == topic.name) {
        await user.save();
        return 1;
      }
    }
    user.lastTopics.push({
      topicName: topic.name,
      pinsLength: topic.pins.length,
    });
    if (user.lastTopics.length > 5) {
      user.lastTopics = user.lastTopics.slice(1, 5);
    }
    await user.save();
    return 1;
  }

  /**
  * @author Aya Abohadima
  * @description make user unfollow topic
  * @param {String} userId -user id  
  * @param {String} topicId - topic id
  * @returns {Number} 1
  */
  async unfollowTopic(userId, topicId) {
    if (!this.ValidationService.checkMongooseID([userId, topicId]))
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    if (!(await this.checkFollowTopic(userId, topicId)))
      throw new HttpException(
        'you dont follow this topic',
        HttpStatus.BAD_REQUEST,
      );
    const user = await this.UserService.getUserById(userId);
    if (!user)
      throw new HttpException(
        'user id is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    const topic = await this.getTopicById(topicId);
    if (!topic)
      throw new HttpException('topic id is not correct', HttpStatus.FORBIDDEN);
    if (!topic.followers)
      throw new HttpException(
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
      .findByIdAndUpdate(userId, { $pull: { followingTopics: { topicId } } })
      .lean();
    return 1;
  }

  /**
   * @author Aya Abohadima
   * @descriptionget user following topic
   * @param {String} userId -user id  
   * @returns {Array<Object>} -following topic object
   */
  async followingTopics(userId) {
    return await this.topicModel.aggregate([
      { $match: { followers: mongoose.Types.ObjectId(userId) } },
      { $project: { followers: { $size: '$followers' }, imageId: 1, name: 1 } },
    ]);
  }
}
