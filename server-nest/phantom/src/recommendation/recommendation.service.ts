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
  async pinMoreLike(userId, pinId) {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0)
      throw new Error('not valid id');
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    let pin = await this.pinModel.findById(pinId);
    if (!pin) throw new Error('no such user');
    let topic = await this.topicModel.findOne({ name: pin.topic });
    let pins = [];
    let pinExist = {};

    for (let i = 0; i < topic.pins.length; i++) {
      if (String(topic.pins[i]) != String(pinId)) {
        let pinTopic = await this.pinModel.findById(topic.pins[i]);
        if (pinTopic) {
          if (pinExist[String(pinTopic._id)] != true) {
            pins.push(pinTopic);
          }
          pinExist[String(pinTopic._id)] = true;
        }
      }
    }
    console.log('sss');
    let allpins = await this.pinModel.find({});
    for (let i = 0; i < allpins.length; i++) {
      if (
        (allpins[i].note &&
          (allpins[i].note.includes(String(pin.title)) ||
            allpins[i].note.includes(String(pin.note)))) ||
        allpins[i].title.includes(String(pin.title)) ||
        allpins[i].title.includes(String(pin.note))
      ) {
        if (pinExist[String(allpins[i]._id)] != true) {
          pins.push(allpins[i]);
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }
    console.log(pins);
    pins = await this.shuffle(pins);
    return pins;
  }
  async boardMoreLike(userId, boardId) {
    if ((await this.ValidationService.checkMongooseID([userId, boardId])) == 0)
      throw new Error('not valid id');
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    let board = await this.boardModel.findById(boardId);
    if (!board) throw new Error('no such user');
    let pins = [];
    let pinExist = {};
    for (let i = 0; i < board.pins.length; i++) {
      let similarPins = await this.pinMoreLike(userId, board.pins[i]);
      for (let j = 0; j < similarPins.length; j++) {
        if (pinExist[String(similarPins[j]._id)] != true) {
          pins.push(similarPins[j]);
        }
        pinExist[String(similarPins[j]._id)] = true;
      }
    }
    if (board.topic && board.topic != '') {
      let topic = await this.topicModel.findOne({ name: board.topic });
      for (let i = 0; i < topic.pins.length; i++) {
        let pinTopic = await this.pinModel.findById(topic.pins[i]);
        if (pinTopic) {
          if (pinExist[String(pinTopic._id)] != true) {
            pins.push(pinTopic);
          }
          pinExist[String(pinTopic._id)] = true;
        }
      }
    }
    let allpins = await this.pinModel.find({});
    for (let i = 0; i < allpins.length; i++) {
      if (
        (allpins[i].note && allpins[i].note.includes(String(board.name))) ||
        allpins[i].title.includes(String(board.name))
      ) {
        if (pinExist[String(allpins[i]._id)] != true) {
          pins.push(allpins[i]);
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }
    for (let i = 0; i < board.pins.length; i++) {
      for (let j = 0; j < pins.length; j++) {
        if (String(pins[j]._id) == String(board.pins[i])) {
          pins.splice(j, 1);
        }
      }
    }
    pins = await this.shuffle(pins);
    return pins;
  }
  async sectionMoreLike(userId, boardId, sectionId) {
    if (
      (await this.ValidationService.checkMongooseID([
        userId,
        boardId,
        sectionId,
      ])) == 0
    )
      throw new Error('not valid id');
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    let board = await this.boardModel.findById(boardId);
    if (!board) throw new Error('no such user');
    let pins = [];
    let pinExist = {};
    let sectionIndex = null;
    for (let k = 0; k < board.sections.length; k++) {
      if (String(sectionId) == String(board.sections[k]._id)) {
        sectionIndex = k;
        for (let i = 0; i < board.sections[k].pins.length; i++) {
          let similarPins = await this.pinMoreLike(
            userId,
            board.sections[k].pins[i],
          );
          for (let j = 0; j < similarPins.length; j++) {
            if (pinExist[String(similarPins[j]._id)] != true) {
              pins.push(similarPins[j]);
            }
            pinExist[String(similarPins[j]._id)] = true;
          }
        }
      }
    }

    let allpins = await this.pinModel.find({});
    for (let i = 0; i < allpins.length; i++) {
      if (
        (allpins[i].note &&
          allpins[i].note.includes(
            String(board.sections[sectionIndex].sectionName),
          )) ||
        allpins[i].title.includes(
          String(board.sections[sectionIndex].sectionName),
        )
      ) {
        if (pinExist[String(allpins[i]._id)] != true) {
          pins.push(allpins[i]);
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }
    for (let i = 0; i < board.sections[sectionIndex].pins.length; i++) {
      for (let j = 0; j < pins.length; j++) {
        if (
          String(pins[j]._id) == String(board.sections[sectionIndex].pins[i])
        ) {
          pins.splice(j, 1);
        }
      }
    }
    pins = await this.shuffle(pins);
    return pins;
  }
}
