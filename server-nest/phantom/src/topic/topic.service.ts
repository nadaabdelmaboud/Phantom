import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { topic } from '../types/topic';
import { ValidationService } from 'src/shared/validation.service';
import { promises, NOTFOUND } from 'dns';
import { pin } from 'src/types/pin';
import { async } from 'rxjs';
import e from 'express';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    private ValidationService: ValidationService,
  ) {}
  async topicsSeeds(topics) {
    console.log(topics);
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
  async getTopicById(topicId, userId): Promise<topic> {
    if (!this.ValidationService.checkMongooseID([topicId]))
      throw new Error('not mongoose id');
    const topic = await this.topicModel.findById(topicId, (err, topic) => {
      if (err) throw new Error('topic not found');
      return topic;
    });
    return topic;
  }
  async getTopics(userId): Promise<topic[]> {
    const topics = await this.topicModel.find({}, (err, topic) => {
      if (err) throw new Error('topic not found');
      return topic;
    });
    return topics;
  }
  async addPinToTopic(topicName, pinId): Promise<Boolean> {
    if (!this.ValidationService.checkMongooseID([pinId]))
      throw new Error('not mongoose id');
    let topic = await this.topicModel.find(
      { name: topicName },
      async (err, topic) => {
        if (err)
          return await this.createTopic(
            undefined,
            undefined,
            undefined,
            undefined,
            topicName,
          );
        return topic;
      },
    );
    const pin = await this.pinModel.findById(pinId, (err, pin) => {
      if (err) return 0;
      else return pin;
    });
    if (topic && pin) {
      topic[0].pins.push(pinId);
      await topic[0].save();
      return true;
    }
    return false;
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
}
