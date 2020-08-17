import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board } from 'src/types/board';
import { pin } from 'src/types/pin';
import { topic } from 'src/types/topic';
import { UserService } from '../shared/user.service';
import { ValidationService } from '../shared/validation.service';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    private UserService: UserService,
    private ValidationService: ValidationService,
  ) {}
  async homeFeed(userId): Promise<Object> {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let pinExist = {};
    let topics = [];
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    if (!user.history) user.history = [];
    if (!user.followingTopics) user.followingTopics = [];

    for (let i = 0; i < user.history.length; i++) {
      topics.push(user.history[i].topic);
      if (!pinExist[String(user.history[i].pinId)])
        pinExist[String(user.history[i].pinId)] = true;
    }
    for (let i = 0; i < user.followingTopics.length; i++) {
      topics.push(user.followingTopics[i]);
    }
    for (let i = 0; i < user.boards.length; i++) {
      let board = await this.boardModel.findById(user.boards[i].boardId);
      if (board) {
        if (board.topic && board.topic != '') {
          topics.push(board.topic);
        } else {
          for (let j = 0; j < board.pins.length; j++) {
            let pin = await this.pinModel.findById(board.pins[j]);
            if (pin) {
              topics.push(pin.topic);
              if (!pinExist[String(pin._id)]) pinExist[String(pin._id)] = true;
            }
          }
          for (let k = 0; k < board.sections.length; k++) {
            for (let j = 0; j < board.sections[k].pins.length; j++) {
              let pin = await this.pinModel.findById(board.sections[k].pins[j]);
              if (pin) {
                topics.push(pin.topic);
                if (!pinExist[String(pin._id)])
                  pinExist[String(pin._id)] = true;
              }
            }
          }
        }
      }
    }
    var freq = {};
    for (let i = 0; i < topics.length; i++) {
      if (!freq[topics[i]]) {
        freq[topics[i]] = 0;
      }
      freq[topics[i]]++;
    }
    let allHome = 0;
    let sortedTopics = [];
    for (let item in freq) {
      sortedTopics.push([item, freq[item]]);
      allHome += freq[item];
    }
    sortedTopics.sort(function(a, b) {
      return b[1] - a[1];
    });
    const MAX_HOME = 50;
    let pinsHome = [];
    for (let i = 0; i < sortedTopics.length; i++) {
      let noOfPins = sortedTopics[i][1];
      let topic = await this.topicModel.findOne({ name: sortedTopics[i][0] });
      for (let k = 0; k < topic.pins.length; k++) {
        if (k == noOfPins) {
          break;
        }
        if (pinExist[String(topic.pins[k])] == true) {
          continue;
        }
        pinExist[String(topic.pins[k])] = true;
        let pin = await this.pinModel.findById(topic.pins[k]);
        pinsHome.push(pin);
      }
    }
    if (pinsHome.length < MAX_HOME) {
      for (let i = 0; i < sortedTopics.length; i++) {
        let topic = await this.topicModel.findOne({ name: sortedTopics[i][0] });
        for (let k = 0; k < topic.pins.length; k++) {
          if (pinsHome.length > MAX_HOME) {
            break;
          }
          if (pinExist[String(topic.pins[k])] == true) {
            continue;
          }
          pinExist[String(topic.pins[k])] = true;
          let pin = await this.pinModel.findById(topic.pins[k]);
          pinsHome.push(pin);
        }
        if (pinsHome.length > MAX_HOME) {
          break;
        }
      }
    }
    if (pinsHome.length < MAX_HOME) {
      let allTopics = await this.topicModel.find({});
      for (let i = 0; i < allTopics.length; i++) {
        for (let k = 0; k < allTopics[i].pins.length; k++) {
          let pin = await this.pinModel.findById(allTopics[i].pins[k]);
          pinsHome.push(pin);
          if (pinsHome.length > MAX_HOME) {
            break;
          }
        }
        if (pinsHome.length > MAX_HOME) {
          break;
        }
      }
      pinsHome = await this.shuffle(pinsHome);
    }
    return pinsHome;
  }
  async shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}
