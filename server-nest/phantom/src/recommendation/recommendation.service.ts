import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board } from 'src/types/board';
import { pin } from 'src/types/pin';
import { topic } from 'src/types/topic';
import { UserService } from '../shared/user.service';
import { ValidationService } from '../shared/validation.service';
import { user } from 'src/types/user';
import { BoardService } from 'src/board/board.service';
import { PinsService } from 'src/pins/pins.service';
import { isDate } from 'util';

@Injectable()
export class RecommendationService {
  followExist: Object;
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('User') private readonly userModel: Model<user>,
    private UserService: UserService,
    private BoardService: BoardService,
    private PinsService: PinsService,
    private ValidationService: ValidationService,
  ) {
    this.followExist = {};
  }
  async followseeds() {
    let topics = await this.topicModel.find({});
    /* for (let i = 11; i < topics.length; i++) {
      console.log(i);
      let count: number = 0;
      for (let j = 0; j < 30; j++) {
        console.log(j);
        let user = {
          firstName: `Nada${j}`,
          password: '12345678',
          birthday: '2000-01-2',
          lastName: String(topics[i].name),
          email: `nadatopic${i}s${j}@gmail.com`,
        };
        let newUser = await this.UserService.createUser(user);
        let board = await this.BoardService.createBoard(
          `Sobarashi ${String(topics[i].name)}`,
          null,
          null,
          'public',
          newUser._id,
        );
      }
    } */
    let users = await this.userModel.find({});
    for (let i = 0; i < topics.length; i++) {
      console.log(i);
      topics[i].recommendedUsers = [];
      for (let j = 0; j < users.length; j++) {
        console.log(j);
        if (users[j].lastName.includes(String(topics[i].name))) {
          topics[i].recommendedUsers.push(users[j]._id);
        }
        if (i > 0 && topics[i].recommendedUsers.length >= 30) {
          break;
        } else if (i == 0 && topics[i].recommendedUsers.length > 30) {
          break;
        }
      }
      await topics[i].save();
    }
    return true;
  }
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
    const part = user.homeFeed.slice(offset, offset + limit);
    return part;
  }
  async homeFeed(userId): Promise<Object> {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let pinExist = {};
    let topics = [];
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    let homeFeedArr = [];
    console.log('jojo');
    await this.userModel
      .update({ _id: userId }, { homeFeed: [] })
      .catch(err => {
        console.log(err);
      });
    console.log('jojo1');
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
          homeFeedArr.push(pin);
          homeFeedArr = [...new Set(homeFeedArr)];
          await this.userModel
            .update({ _id: userId }, { homeFeed: homeFeedArr })
            .catch(err => {
              console.log(err);
            });
          pinsHome.push(pin);
        }
      }
      count += 10;
    }
    if (pinsHome.length < 20) {
      let allTopics = await this.topicModel.find({});
      for (let i = 0; i < allTopics.length; i++) {
        for (let j = 0; j < 10; j++) {
          if (pinExist[String(allTopics[i].pins[j])] == true) {
            continue;
          }
          pinExist[String(allTopics[i].pins[j])] = true;
          let pin = await this.pinModel.findById(allTopics[i].pins[j]);
          homeFeedArr.push(pin);
          homeFeedArr = [...new Set(homeFeedArr)];
          await this.userModel
            .update({ _id: userId }, { homeFeed: homeFeedArr })
            .catch(err => {
              console.log(err);
            });
          pinsHome.push(pin);
        }
      }
    }
    return { total: homeFeedArr.length };
  }

  async shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  async topicRecommendation(topicName, userId) {
    let followers = [];
    let topic = await this.topicModel.findOne({ name: topicName });
    for (let i = 0; i < topic.recommendedUsers.length; i++) {
      if (String(topic.recommendedUsers[i]) != String(userId)) {
        let user = await this.userModel.findById(topic.recommendedUsers[i]);
        followers.push(user);
      }
    }
    followers = followers.sort(function(a, b) {
      if (a.followers > b.followers) {
        return -1;
      } else if (a.followers < b.followers) {
        return 1;
      } else {
        return 0;
      }
    });
    return followers;
  }
  async trendingRecommendation(userId) {
    let followers = [];
    let topUsers = await this.userModel
      .find({})
      .sort({ followers: -1 })
      .limit(100);
    for (let i = 0; i < topUsers.length; i++) {
      if (String(topUsers[i]._id) != String(userId)) {
        followers.push({
          user: topUsers[i],
          recommendType: 'popular phantom accounts',
        });
      }
    }
    return followers;
  }
  async followAllRecommendation(userId) {
    let followers = [];
    let user = await this.UserService.getUserById(userId);
    if (!user) throw new Error('no such user');
    this.followExist = {};
    let topics = [];
    let historyLimit: number = -1;
    let followTopicsLimit: number;
    let followUsersLimit: number;
    console.log('here 1');
    for (let i = 0; i < user.history.length; i++) {
      if (!topics.includes(user.history[i].topic)) {
        topics.push(user.history[i].topic);
        historyLimit++;
      }
    }
    console.log('here 2');
    followTopicsLimit = historyLimit;
    for (let i = 0; i < user.followingTopics.length; i++) {
      let topic = await this.topicModel.findById(user.followingTopics[i]);
      if (!topics.includes(topic.name)) {
        topics.push(topic.name);
        followTopicsLimit++;
      }
    }
    console.log('here 3');
    followUsersLimit = followTopicsLimit;
    for (let i = 0; i < user.following.length; i++) {
      let follower = await this.userModel.findById(user.following[i]);
      for (let j = 0; j < follower.followingTopics.length; j++) {
        let topic = await this.topicModel.findById(follower.followingTopics[j]);
        if (!topics.includes(topic.name)) {
          topics.push(topic.name);
          followUsersLimit++;
        }
      }
    }
    console.log('here 4');
    for (let i = 0; i <= historyLimit; i++) {
      let topic = await this.topicModel.findOne({ name: String(topics[i]) });
      let count: number = 0;
      for (let j = 0; j < topic.recommendedUsers.length; j++) {
        if (
          String(topic.recommendedUsers[j] != userId) &&
          this.followExist[String(topic.recommendedUsers[j])] != true
        ) {
          let recomUser = await this.userModel.findById(
            topic.recommendedUsers[j],
          );
          followers.push({
            user: recomUser,
            recommendType: 'based on your recent activity',
          });
          count++;
          this.followExist[String(topic.recommendedUsers[j])] = true;
          if (count >= 20) {
            break;
          }
        }
      }
    }
    console.log('here 5');
    for (let i = historyLimit + 1; i <= followTopicsLimit; i++) {
      let topic = await this.topicModel.findOne({ name: String(topics[i]) });
      let count: number = 0;
      for (let j = 0; j < topic.recommendedUsers.length; j++) {
        if (
          String(topic.recommendedUsers[j] != userId) &&
          this.followExist[String(topic.recommendedUsers[j])] != true
        ) {
          let recomUser = await this.userModel.findById(
            topic.recommendedUsers[j],
          );
          followers.push({
            user: recomUser,
            recommendType: 'based on your interest',
          });
          count++;
          this.followExist[String(topic.recommendedUsers[j])] = true;
          if (count >= 20) {
            break;
          }
        }
      }
    }
    console.log('here 6');
    for (let i = followTopicsLimit + 1; i <= followUsersLimit; i++) {
      let topic = await this.topicModel.findOne({ name: String(topics[i]) });
      let count: number = 0;
      for (let j = 0; j < topic.recommendedUsers.length; j++) {
        if (
          String(topic.recommendedUsers[j] != userId) &&
          this.followExist[String(topic.recommendedUsers[j])] != true
        ) {
          let recomUser = await this.userModel.findById(
            topic.recommendedUsers[j],
          );
          followers.push({
            user: recomUser,
            recommendType: 'based on people you follow',
          });
          count++;

          this.followExist[String(topic.recommendedUsers[j])] = true;
          if (count >= 20) {
            break;
          }
        }
      }
    }
    let topUsers = await this.userModel
      .find({})
      .sort({ followers: -1 })
      .limit(20);
    for (let i = 0; i < topUsers.length; i++) {
      if (this.followExist[String(topUsers[i]._id)] != true) {
        followers.push({
          user: topUsers[i],
          recommendType: 'popular on phantom',
        });
        this.followExist[String(topUsers[i]._id)] = true;
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
