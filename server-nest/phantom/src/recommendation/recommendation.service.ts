import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board } from 'src/types/board';
import { pin } from 'src/types/pin';
import { topic } from 'src/types/topic';
import { UserService } from '../shared/user.service';
import { ValidationService } from '../shared/validation.service';
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
  async getHomeFeed(userId, limit: number, offset: number) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    if (!user.homeFeed) user.homeFeed = [];
    console.log(user.homeFeed.length);
    console.log(offset + limit);
    if (Number(Number(offset) + Number(limit)) > user.homeFeed.length) {
      throw new NotFoundException('invalid offset limit || not enough data');
    }
    return user.homeFeed.slice(offset, offset + limit);
  }
  async homeFeed(userId): Promise<Object> {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let pinExist = {};
    let topics = [];
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    user.homeFeed = [];
    await user.save();
    console.log(user.followingTopics);

    if (!user.history) user.history = [];
    if (!user.followingTopics) user.followingTopics = [];
    for (let i = 0; i < user.history.length; i++) {
      topics.push(user.history[i].topic);
      if (!pinExist[String(user.history[i].pinId)])
        pinExist[String(user.history[i].pinId)] = true;
    }

    for (let i = 0; i < user.followingTopics.length; i++) {
      let followTopic = await this.topicModel.findById(user.followingTopics[i]);
      console.log(followTopic.name);
      if (followTopic) {
        topics.push(followTopic.name);
      }
    }
    console.log('here1');
    for (let i = 0; i < user.boards.length; i++) {
      let board = await this.boardModel.findById(user.boards[i].boardId);
      if (board && board.personalization) {
        if (board.topic && board.topic != '') {
          topics.push(board.topic);
        } else {
          for (let j = 0; j < board.pins.length; j++) {
            topics.push(board.pins[j].topic);
            if (!pinExist[String(board.pins[j].pinId)])
              pinExist[String(board.pins[j].pinId)] = true;
          }
          for (let k = 0; k < board.sections.length; k++) {
            for (let j = 0; j < board.sections[k].pins.length; j++) {
              topics.push(board.sections[k].pins[j].topic);
              if (!pinExist[String(board.sections[k].pins[j].pinId)])
                pinExist[String(board.sections[k].pins[j].pinId)] = true;
            }
          }
        }
      }
    }
    console.log('here2');

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
    console.log(freq);
    sortedTopics.sort(function(a, b) {
      return b[1] - a[1];
    });

    let pinsHome = [];
    let count = 0;
    let out = 0;
    while (out < sortedTopics.length) {
      for (let i = 0; i < sortedTopics.length; i++) {
        let topic = await this.topicModel.findOne({ name: sortedTopics[i][0] });
        for (let k = count; k < count + 10; k++) {
          if (k >= topic.pins.length) {
            out++;
            break;
          }
          if (pinExist[String(topic.pins[k])] == true) {
            continue;
          }
          pinExist[String(topic.pins[k])] = true;
          let pin = await this.pinModel.findById(topic.pins[k]);
          user.homeFeed.push(pin);
          await user.save();
          pinsHome.push(pin);
        }
      }
      count += 10;
    }

    return true;
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
  async pinMoreLike(
    userId,
    pinId,
    isboard,
    limit,
    board,
    boardExist,
    sectionIndex,
  ) {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0)
      throw new Error('not valid id');
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    let pin = await this.pinModel.findById(pinId);
    if (!pin) throw new Error('no such user');
    pin.more = [];
    await pin.save();
    let topic = await this.topicModel.findOne({ name: pin.topic });
    let pins = [];
    let pinExist = {};
    if (isboard) {
      for (let i = 0; i < topic.pins.length; i++) {
        if (pins.length >= Number(limit)) {
          break;
        }
        if (String(topic.pins[i]) != String(pinId)) {
          let pinTopic = await this.pinModel.findById(topic.pins[i]);
          if (pinTopic) {
            if (
              boardExist[String(pinTopic._id)] != true &&
              pinExist[String(pinTopic._id)] != true
            ) {
              if (sectionIndex && sectionIndex != null) {
                board.sections[sectionIndex].more.push(pinTopic);
                await board.save();
              } else {
                board.more.push(pinTopic);
                await board.save();
              }
              pins.push(pinTopic);
            }
            boardExist[String(pinTopic._id)] = true;
            pinExist[String(pinTopic._id)] = true;
          }
        }
      }
      return pins;
    }
    for (let i = 0; i < topic.pins.length; i++) {
      if (String(topic.pins[i]) != String(pinId)) {
        let pinTopic = await this.pinModel.findById(topic.pins[i]);
        if (pinTopic) {
          if (pinExist[String(pinTopic._id)] != true) {
            pin.more.push(pinTopic);
            await pin.save();
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
          pin.more.push(allpins[i]);
          await pin.save();
          pins.push(allpins[i]);
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }
    console.log(pins);
    return pins;
  }
  async boardMoreLike(userId, boardId) {
    if ((await this.ValidationService.checkMongooseID([userId, boardId])) == 0)
      throw new Error('not valid id');
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    let board = await this.boardModel.findById(boardId);
    if (!board) throw new Error('no such user');
    board.more = [];
    await board.save();
    let pins = [];
    let pinExist = {};
    let limit = board.pins.length > 30 ? 10 : 100;
    for (let i = 0; i < board.pins.length; i++) {
      let similarPins = await this.pinMoreLike(
        userId,
        board.pins[i].pinId,
        true,
        limit,
        board,
        pinExist,
        null,
      );
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
            board.more.push(pinTopic);
            await board.save();
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
          board.more.push(allpins[i]);
          await board.save();
          pins.push(allpins[i]);
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }

    return true;
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
        board.sections[k].more = [];
        await board.save();
        let limit = board.sections[k].pins.length > 30 ? 10 : 100;
        for (let i = 0; i < board.sections[k].pins.length; i++) {
          let similarPins = await this.pinMoreLike(
            userId,
            board.sections[k].pins[i].pinId,
            true,
            limit,
            board,
            pinExist,
            sectionIndex,
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
          board.sections[sectionIndex].more.push(allpins[i]);
          await board.save();
          pins.push(allpins[i]);
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }

    return true;
  }
  async getPinMoreLike(pinId, limit, offset) {
    if ((await this.ValidationService.checkMongooseID([pinId])) == 0)
      throw new Error('not valid id');
    let pin = await this.pinModel.findById(pinId);
    if (!pin) throw new Error('no such pin');
    if (!pin.more) pin.more = [];
    console.log(pin.more.length);
    console.log(offset + limit);
    if (Number(Number(offset) + Number(limit)) > pin.more.length) {
      throw new NotFoundException('invalid offset limit || not enough data');
    }
    return pin.more.slice(offset, offset + limit);
  }
  async getBoardMoreLike(boardId, offset, limit) {
    if ((await this.ValidationService.checkMongooseID([boardId])) == 0)
      throw new Error('not valid id');
    let board = await this.boardModel.findById(boardId);
    if (!board) throw new Error('no such board');
    if (!board.more) board.more = [];
    console.log(board.more.length);
    console.log(offset + limit);
    if (Number(Number(offset) + Number(limit)) > board.more.length) {
      throw new NotFoundException('invalid offset limit || not enough data');
    }
    return board.more.slice(offset, offset + limit);
  }
  async getSectionMoreLike(boardId, sectionId, offset, limit) {
    if (
      (await this.ValidationService.checkMongooseID([boardId, sectionId])) == 0
    )
      throw new Error('not valid id');
    let board = await this.boardModel.findById(boardId);
    if (!board) throw new Error('no such board');
    for (let i = 0; i < board.sections.length; i++) {
      if (String(board.sections[i]._id) == String(sectionId)) {
        if (!board.sections[i].more) board.sections[i].more = [];
        console.log(board.sections[i].more.length);
        console.log(offset + limit);
        if (
          Number(Number(offset) + Number(limit)) > board.sections[i].more.length
        ) {
          throw new NotFoundException(
            'invalid offset limit || not enough data',
          );
        }
        return board.sections[i].more.slice(offset, offset + limit);
      }
    }
  }
}
