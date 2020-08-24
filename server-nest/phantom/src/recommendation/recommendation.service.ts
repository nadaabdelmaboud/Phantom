import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board } from 'src/types/board';
import { pin } from 'src/types/pin';
import { topic } from 'src/types/topic';
import { UserService } from '../shared/user.service';
import { ValidationService } from '../shared/validation.service';
import { pipe } from 'rxjs';
import { user } from 'src/types/user';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('User') private readonly userModel: Model<user>,
    private UserService: UserService,
    private ValidationService: ValidationService,
  ) {}
  async homeFeed(userId): Promise<Object> {
    console.log('fff');
    console.log(process.hrtime());
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let pinExist = {};
    let topics = [];
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    if (!user.history) user.history = [];
    if (!user.followingTopics) user.followingTopics = [];
    let hrstart = process.hrtime();
    for (let i = 0; i < user.history.length; i++) {
      topics.push(user.history[i].topic);
      if (!pinExist[String(user.history[i].pinId)])
        pinExist[String(user.history[i].pinId)] = true;
    }
    let hrend = process.hrtime(hrstart);
    console.info(
      'Execution time This history loop took (hr): %ds %dms',
      hrend[0],
      hrend[1] / 1000000,
    );
    console.log(user);
    hrstart = process.hrtime();
    for (let i = 0; i < user.followingTopics.length; i++) {
      let followTopic = await this.topicModel.findById(user.followingTopics[i]);
      console.log(followTopic.name);
      if (followTopic) {
        topics.push(followTopic.name);
      }
    }
    hrend = process.hrtime(hrstart);
    console.info(
      'Execution time This following topics loop took (hr): %ds %dms',
      hrend[0],
      hrend[1] / 1000000,
    );

    hrstart = process.hrtime();
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
    hrend = process.hrtime(hrstart);

    console.info(
      'Execution time This board loop took (hr): %ds %dms',
      hrend[0],
      hrend[1] / 1000000,
    );

    hrstart = process.hrtime();
    var freq = {};
    for (let i = 0; i < topics.length; i++) {
      if (!freq[topics[i]]) {
        freq[topics[i]] = 0;
      }
      freq[topics[i]]++;
    }
    hrend = process.hrtime(hrstart);
    console.info(
      'Execution time This freq loop took (hr): %ds %dms',
      hrend[0],
      hrend[1] / 1000000,
    );

    let allHome = 0;
    let sortedTopics = [];
    hrstart = process.hrtime();
    for (let item in freq) {
      sortedTopics.push([item, freq[item]]);
      allHome += freq[item];
    }
    console.log(freq);
    sortedTopics.sort(function(a, b) {
      return b[1] - a[1];
    });
    hrend = process.hrtime(hrstart);
    console.info(
      'Execution time This sorting loop took (hr): %ds %dms',
      hrend[0],
      hrend[1] / 1000000,
    );

    const MAX_HOME = 50;
    let pinsHome = [];
    hrstart = process.hrtime();
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
    hrend = process.hrtime(hrstart);

    console.info(
      'Execution time This topics loop took (hr): %ds %dms',
      hrend[0],
      hrend[1] / 1000000,
    );
    hrstart = process.hrtime();
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
    if (pinsHome.length == 0) {
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
    }
    pinsHome = await this.shuffle(pinsHome);
    hrend = process.hrtime(hrstart);

    console.info(
      'Execution time This last loop took (hr): %ds %dms',
      hrend[0],
      hrend[1] / 1000000,
    );
    return pinsHome;
  }

  async shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  async topicRecommendation(topicName) {
    //nas 3ndha board bnfs 2l2sm
    //nas 3ndha board 2l topic bta3ha nfs 2l topic
    //nas 2l2sm bta3ha nfs 2sm 2ltopic
    //nas 3ndha board 2l description leh 2sm 2ltopic
  }
  async followRecommendation(userId) {
    //let topics
    //hgm3 topics based on interst de howa 3amlha follow
    //based on people you follow - hgeb topics 2l boards bta3thom
    //based on recent activity hgeb topics 2l pinsr
    //bltali da kolo hytms7
    let followers = [];
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    let userExist = {};
    let users = await this.userModel.find({});
    for (let i = 0; i < user.followingTopics.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (users[j].followingTopics.includes(user.followingTopics[i])) {
          if (userExist[String(users[j]._id)] != true) {
            followers.push({
              user: users[j],
              recommendType: 'based on you interest',
            });
            userExist[String(users[j]._id)] = true;
          }
        }
      }
    }
    for (let i = 0; i < user.following.length; i++) {
      let followUser = await this.userModel.findById(user.following[i]);
      for (let j = 0; j < followUser.following.length; j++) {
        if (userExist[String(followUser.following[j])] != true) {
          let pushUser = await this.userModel.findById(followUser.following[j]);
          followers.push({
            user: pushUser,
            recommendType: 'based on people you follow',
          });
          userExist[String(followUser.following[j])] = true;
        }
      }
    }
    let topics = [];
    for (let i = 0; i < user.history.length; i++) {
      if (!topics.includes(user.history[i].topic)) {
        let topic = await this.topicModel.findOne({
          name: user.history[i].topic,
        });
        topics.push(topic._id);
      }
    }
    for (let i = 0; i < topics.length; i++) {
      for (let j = 0; j < users.length; j++) {
        if (users[j].followingTopics.includes(topics[i])) {
          if (userExist[String(users[j]._id)] != true) {
            followers.push({
              user: users[j],
              recommendType: 'based on your recent activity',
            });
            userExist[String(users[j]._id)] = true;
          }
        }
      }
    }
    let topUsers = await users.sort(function(a, b) {
      if (a.followers.length > b.followers.length) {
        return -1;
      }
      if (a.followers.length < b.followers.length) {
        return 1;
      }
      return 0;
    });
    for (let i = 0; i < topUsers.length; i++) {
      if (userExist[String(topUsers[i]._id)] != true) {
        followers.push({
          user: topUsers[i],
          recommendType: 'popular on phantom',
        });
        userExist[String(topUsers[i]._id)] = true;
      }
    }
    followers = await this.shuffle(followers);
    return followers;
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
