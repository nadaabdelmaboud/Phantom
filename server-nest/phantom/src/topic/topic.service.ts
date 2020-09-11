import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { topic } from '../types/topic';
import { ValidationService } from 'src/shared/validation.service';
import { UserService } from 'src/shared/user.service';
import { promises, NOTFOUND } from 'dns';
import { pin } from 'src/types/pin';
import { async } from 'rxjs';
import e from 'express';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    private UserService: UserService,
    private ValidationService: ValidationService,
  ) {}
  async topicsSeeds(topics) {
    for (var i = 0; i < topics.length; i++) {
      let topic = await this.createTopic(
        topics[i].imageId,
        '',
        200,
        200,
        topics[i].name,
      );
    }
    return true;
  }
  async editTopic(topics) {
    for (let i = 0; i < topics.length; i++) {
      await this.topicModel.findOneAndUpdate(
        { name: topics[i].name },
        { imageId: topics[i].imageId },
      );
    }
    return 1;
  }
  async createTopic(imageId, description, imageWidth, imageHeight, name) {
    if (!this.ValidationService.checkMongooseID([imageId]))
      throw new Error('not mongoose id');
    let topicExist = await this.topicModel.findOne({ name: name });
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
  async getTopicById(topicId, userId) {
    if (!this.ValidationService.checkMongooseID([topicId]))
      throw new Error('not mongoose id');
    const topic = await this.topicModel.findById(topicId, (err, topic) => {
      if (err) throw new Error('topic not found');
      return topic;
    });
    return topic;
  }
  async getTopics(userId): Promise<topic[]> {
    const topics = await this.topicModel
      .find({}, { name: 1, description: 1, imageId: 1, followers: 1 })
      .lean();
    let topicInfo = [];
    let topic = {};
    for (let i = 0; i < topics.length; i++) {
      let isFollow = topics[i].followers.includes(userId);
      topic['follow'] = isFollow;
      topic['_id'] = topics[i]._id;
      topic['name'] = topics[i].name;
      topic['description'] = topics[i].description;
      topic['imageId'] = topics[i].imageId;
      topicInfo.push(topic);
      topic = {};
    }
    console.log(topics.length);
    return topicInfo;
  }
  async addPinToTopic(topicName, pinId): Promise<Boolean> {
    if (!this.ValidationService.checkMongooseID([pinId]))
      throw new Error('not mongoose id');
    let topic = await this.topicModel.find({ name: topicName });
    let id = mongoose.Types.ObjectId(pinId);
    const pin = await this.pinModel.findById(id);
    console.log(pin);
    console.log(topic);
    if (!pin) throw new NotFoundException();
    pin.topic = topicName;
    await pin.save().catch(err => {
      console.log(err);
    });
    console.log('asas');
    console.log(pin);
    console.log(topic[0]);
    if (topic && pin) {
      topic[0].pins.push(pinId);
      await topic[0].save().catch(err => {
        console.log(err);
      });
      return true;
    }
    throw new NotFoundException();
  }
  async getPinsOfTopic(topicId, limit, offset, userId): Promise<pin[]> {
    if (!this.ValidationService.checkMongooseID([topicId]))
      throw new Error('not mongoose id');
    const topic = await this.getTopicById(topicId, userId);
    if (topic.pins.length) return [];
    let pinsIds = await this.ValidationService.limitOffset(
      limit,
      offset,
      topic.pins,
    );
    let pins = [];
    for (let i = 0; i < pinsIds.length; i++) {
      await this.pinModel.findById(pinsIds[i], (err, pin) => {
        if (pin) pins.push(pin);
      });
    }
    return pins;
  }
  async checkFollowTopic(userId, topicId) {
    if (!this.ValidationService.checkMongooseID([userId, topicId]))
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    const user = await this.UserService.getUserById(userId);

    if (!user)
      throw new HttpException(
        'user id is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    const topic = await this.getTopicById(topicId, userId);
    //console.log(11);
    if (!topic)
      throw new HttpException('topic id is not correct', HttpStatus.FORBIDDEN);
    //console.log(12);
    if (!topic.followers || topic.followers.length == 0) return false;
    //console.log(13);
    for (let i = 0; i < topic.followers.length; i++) {
      //console.log(14);
      if (String(userId) == String(topic.followers[i])) {
        //console.log(15)
        return true;
      }
    }
    //console.log(16)
    return false;
  }
  async followTopic(userId, topicId) {
    //console.log(40000)

    if (!this.ValidationService.checkMongooseID([userId, topicId]))
      throw new HttpException('there is not correct id ', HttpStatus.FORBIDDEN);
    //console.log(100000);
    if (await this.checkFollowTopic(userId, topicId))
      throw new HttpException(
        'you are already follow this topic',
        HttpStatus.BAD_REQUEST,
      );
    //console.log(100);

    const user = await this.UserService.getUserById(userId);
    //console.log(0);
    if (!user)
      throw new HttpException(
        'user id is not correct',
        HttpStatus.UNAUTHORIZED,
      );
    const topic = await this.getTopicById(topicId, userId);

    //console.log(1);
    if (!topic)
      throw new HttpException('topic id is not correct', HttpStatus.FORBIDDEN);
    if (!topic.followers) topic.followers = [];
    topic.followers.push(userId);
    //console.log(2);
    await topic.save();
    //console.log(3);
    if (!user.followingTopics) user.followingTopics = [];
    user.followingTopics.push(topicId);
    //console.log(4);
    await user.save();
    //console.log(5)
    //  await this.topicModel.update({}, { followers: [] });

    return 1;
  }

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
    const topic = await this.getTopicById(topicId, userId);
    if (!topic)
      throw new HttpException('topic id is not correct', HttpStatus.FORBIDDEN);
    if (!topic.followers)
      throw new HttpException(
        'you dont follow this topic',
        HttpStatus.BAD_REQUEST,
      );
    for (let i = 0; i < topic.followers.length; i++)
      if (String(userId) == String(topic.followers[i]))
        topic.followers.splice(i, 1);
    await topic.save();
    if (!user.followingTopics)
      throw new HttpException(
        'you dont follow this topic',
        HttpStatus.BAD_REQUEST,
      );
    for (let i = 0; i < user.followingTopics.length; i++)
      if (String(topicId) == String(user.followingTopics[i]))
        user.followingTopics.splice(i, 1);
    await user.save();
    return 1;
  }

  async followingTopics(userId) {
    const followingTopics = await this.UserService.followingTopics(userId);
    if (!followingTopics || followingTopics.length == 0) return [];
    var topics = [];
    for (let i = 0; i < followingTopics.length; i++) {
      const topic = await this.topicModel.findById(followingTopics[i]);
      if (topic) topics.push(topic);
    }
    return topics;
  }
}
