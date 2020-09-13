import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { board } from '../types/board';
import { pin } from '../types/pin';
import { topic } from '../types/topic';
import { UserService } from '../shared/user.service';
import { ValidationService } from '../shared/validation.service';
import { user } from '../types/user';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class RecommendationService {
  followExist: Object;
  offsetArr: Array<number>;
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('User') private readonly userModel: Model<user>,
    private UserService: UserService,
    private NotificationService: NotificationService,

    private ValidationService: ValidationService,
  ) {
    this.followExist = {};
    this.offsetArr = [];
  }

  async getHomeFeed(userId, limit: number, offset: number) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId, { homeFeed: 1 });
    if (!user) throw new Error('no such user');
    if (!user.homeFeed) user.homeFeed = [];
    console.log(user.homeFeed.length);
    console.log(offset + limit);
    if (Number(Number(offset) + Number(limit)) > user.homeFeed.length) {
      throw new NotFoundException('invalid offset limit || not enough data');
    }

    const part = await user.homeFeed.slice(
      Number(offset),
      Number(Number(offset) + Number(limit)),
    );
    return part;
  }
  async checkDublicates(values) {
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        console.log('i = ', values[i]._id);
        console.log('j = ', values[j]._id);
        if (String(values[i]._id) == String(values[j]._id)) {
          return true;
        }
      }
    }
    return false;
  }
  async homeFeed(userId): Promise<Object> {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let pinExist = {};
    let topics = [];
    let user = await this.userModel.findById(userId, {
      history: 1,
      followingTopics: 1,
      homeFeed: 1,
      boards: 1,
    });
    if (!user) throw new Error('no such user');
    let homeFeedArr = [];
    console.log('jojo');
    await this.userModel
      .update({ _id: userId }, { homeFeed: [] })
      .catch(err => {
        console.log(err);
      });

    if (!user.history) user.history = [];
    if (!user.followingTopics) user.followingTopics = [];
    for (let i = user.history.length - 1; i >= 0; i--) {
      topics.push(user.history[i].topic);
      if (!pinExist[String(user.history[i].pinId)])
        pinExist[String(user.history[i].pinId)] = true;
    }

    for (let i = user.followingTopics.length - 1; i >= 0; i--) {
      let followTopic = await this.topicModel.findById(
        user.followingTopics[i],
        { name: 1 },
      );
      console.log(followTopic.name);
      if (followTopic) {
        topics.push(followTopic.name);
      }
    }
    console.log('here1');
    for (let i = 0; i < user.boards.length; i++) {
      let board = await this.boardModel
        .findById(user.boards[i].boardId, {
          topic: 1,
          personalization: 1,
          pins: 1,
          sections: 1,
        })
        .lean();
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
        let topic = await this.topicModel
          .findOne({ name: sortedTopics[i][0] }, { pins: 1 })
          .lean();
        for (let k = count; k < count + 10; k++) {
          if (k >= topic.pins.length) {
            out++;
            break;
          }
          if (pinExist[String(topic.pins[k])] == true) {
            continue;
          }
          pinExist[String(topic.pins[k])] = true;
          let pin = await this.pinModel
            .findById(topic.pins[k], {
              imageId: 1,
              imageHeight: 1,
              imageWidth: 1,
            })
            .lean();
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
      let allTopics = await this.topicModel.find({}, { pins: 1 }).lean();
      for (let i = 0; i < allTopics.length; i++) {
        for (let j = 0; j < 10; j++) {
          if (pinExist[String(allTopics[i].pins[j])] == true) {
            continue;
          }
          pinExist[String(allTopics[i].pins[j])] = true;
          let pin = await this.pinModel
            .findById(allTopics[i].pins[j], {
              imageId: 1,
              imageHeight: 1,
              imageWidth: 1,
            })
            .lean();
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
    for (let i = user.history.length - 1; i >= 0; i--) {
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
      for (let i = topic.pins.length - 1; i >= 0; i--) {
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
    for (let i = topic.pins.length - 1; i >= 0; i--) {
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
    for (let i = allpins.length - 1; i >= 0; i--) {
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
  async boardsForYou(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let boards = [];
    let user = await this.userModel.findById(userId, {
      notifications: 1,
      boards: 1,
      following: 1,
      followingTopics: 1,
      notificationCounter: 1,
      fcmToken: 1,
      boardsForYou: 1,
    });
    if (!user.boardsForYou) {
      throw new BadRequestException('user should allow boards for you first');
    }
    let allBoards = await this.boardModel.find(
      {},
      {
        topic: 1,
        name: 1,
        counts: 1,
        description: 1,
        coverImages: 1,
      },
    );
    for (let i = 0; i < user.boards.length; i++) {
      let count = 0;
      for (let j = allBoards.length - 1; j >= 0; j--) {
        if (count == 10) break;
        if (String(allBoards[j]._id) != String(user.boards[i].boardId)) {
          let board = await this.boardModel.findById(user.boards[i].boardId, {
            name: 1,
            topic: 1,
            description: 1,
          });
          if (
            allBoards[j].topic == board.topic ||
            allBoards[j].name.includes(String(board.name)) ||
            board.name.includes(String(allBoards[j].name)) ||
            allBoards[j].description.includes(String(board.description)) ||
            board.description.includes(String(allBoards[j].description))
          ) {
            if (!boards.includes(allBoards[j])) {
              boards.push(allBoards[j]);
              count++;
              if (boards.length >= 50) {
                boards = await this.shuffle(boards);
                for (let k = 0; k < user.boards.length; k++) {
                  for (let n = 0; n < boards.length; n++) {
                    if (
                      String(user.boards[k].boardId) == String(boards[n]._id)
                    ) {
                      boards.splice(n, 1);
                    }
                  }
                }

                let images = [];
                let count: number = 0;
                for (let i = 0; i < boards.length; i++) {
                  if (count >= 5) break;
                  if (boards[i].coverImages.length > 0) {
                    count++;
                    images.push(boards[i].coverImages[0]);
                  }
                }
                let res = await this.NotificationService.boardsForYou(
                  user,
                  boards,
                  images,
                );
                return 1;
              }
            }
          }
        }
      }
    }
    console.log('1 ', boards.length);
    for (let i = 0; i < user.followingTopics.length; i++) {
      let topic = await this.topicModel.findById(user.followingTopics[i], {
        name: 1,
      });
      let count = 0;
      for (let j = allBoards.length - 1; j >= 0; j--) {
        if (count > 5) break;
        if (
          allBoards[j].topic == topic.name ||
          allBoards[j].name.includes(String(topic.name)) ||
          topic.name.includes(String(allBoards[j].name)) ||
          allBoards[j].description.includes(String(topic.name))
        ) {
          if (!boards.includes(allBoards[j])) {
            boards.push(allBoards[j]);
            count++;
            if (boards.length >= 50) {
              boards = await this.shuffle(boards);
              for (let k = 0; k < user.boards.length; k++) {
                for (let n = 0; n < boards.length; n++) {
                  if (String(user.boards[k].boardId) == String(boards[n]._id)) {
                    boards.splice(n, 1);
                  }
                }
              }

              let images = [];
              let count: number = 0;
              for (let i = 0; i < boards.length; i++) {
                if (count >= 5) break;
                if (boards[i].coverImages.length > 0) {
                  count++;
                  images.push(boards[i].coverImages[0]);
                }
              }
              let res = await this.NotificationService.boardsForYou(
                user,
                boards,
                images,
              );
              return 1;
            }
          }
        }
      }
    }
    console.log('2 ', boards.length);

    for (let i = 0; i < user.following.length; i++) {
      let following = await this.userModel.findById(user.following[i], {
        boards: 1,
      });
      for (let j = 0; j < following.boards.length; j++) {
        let board = await this.boardModel.findById(
          following.boards[j].boardId,
          { topic: 1, name: 1, counts: 1, description: 1, coverImages: 1 },
        );
        if (!boards.includes(board)) {
          boards.push(board);
          if (boards.length >= 50) {
            boards = await this.shuffle(boards);
            for (let k = 0; k < user.boards.length; k++) {
              for (let n = 0; n < boards.length; n++) {
                if (String(user.boards[k].boardId) == String(boards[n]._id)) {
                  boards.splice(n, 1);
                }
              }
            }

            let images = [];
            let count: number = 0;
            for (let i = 0; i < boards.length; i++) {
              if (count >= 5) break;
              if (boards[i].coverImages.length > 0) {
                count++;
                images.push(boards[i].coverImages[0]);
              }
            }
            let res = await this.NotificationService.boardsForYou(
              user,
              boards,
              images,
            );
            return 1;
          }
        }
      }
    }
    console.log('3 ', boards.length);
    for (let k = 0; k < user.boards.length; k++) {
      for (let n = 0; n < boards.length; n++) {
        if (String(user.boards[k].boardId) == String(boards[n]._id)) {
          boards.splice(n, 1);
        }
      }
    }
    boards = await this.shuffle(boards);
    console.log('4 ', boards.length);

    let images = [];
    let count: number = 0;
    for (let i = 0; i < boards.length; i++) {
      if (count >= 5) break;
      if (boards[i].coverImages.length > 0) {
        count++;
        images.push(boards[i].coverImages[0]);
      }
    }
    let res = await this.NotificationService.boardsForYou(user, boards, images);
    return 1;
  }
  async popularPins(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId);
    if (!user.popularPins) {
      throw new BadRequestException('user should allow popular pins first');
    }
    let allPins = await this.pinModel
      .find({})
      .sort({ reacts: -1 })
      .limit(100);

    for (let i = 0; i < user.pins.length; i++) {
      for (let j = 0; j < allPins.length; j++) {
        if (String(allPins[j]._id) == String(user.pins[i].pinId)) {
          allPins.splice(j, 1);
        }
      }
    }
    for (let i = 0; i < user.savedPins.length; i++) {
      for (let j = 0; j < allPins.length; j++) {
        if (String(allPins[j]._id) == String(user.savedPins[i].pinId)) {
          allPins.splice(j, 1);
        }
      }
    }

    let images = [];
    let count: number = 0;
    for (let i = 0; i < allPins.length; i++) {
      if (count >= 5) break;
      if (allPins[i].imageId) {
        count++;
        images.push(allPins[i].imageId);
      }
    }
    console.log('here');
    let res = await this.NotificationService.popularPins(user, allPins, images);
    console.log('here2');
    return 1;
  }
  async pinsForYou(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId);
    if (!user.pinsForYou) {
      throw new BadRequestException('user should allow pins for you first');
    }
    let topics = [];
    let pins = [];
    console.log('1');
    for (let i = 0; i < user.pins.length; i++) {
      let pin = await this.pinModel.findById(user.pins[i].pinId);
      if (pin && !topics.includes(String(pin.topic))) {
        topics.push(String(pin.topic));
      }
    }
    console.log('2');
    for (let i = 0; i < user.savedPins.length; i++) {
      let pin = await this.pinModel.findById(user.savedPins[i].pinId);
      if (pin && !topics.includes(String(pin.topic))) {
        topics.push(String(pin.topic));
      }
    }
    console.log('3');
    for (let i = 0; i < user.followingTopics.length; i++) {
      let topic = await this.topicModel.findById(user.followingTopics[i]);
      if (topic && !topics.includes(String(topic.name))) {
        topics.push(String(topic.name));
      }
    }
    console.log('4');
    for (let i = 0; i < topics.length; i++) {
      let topic = await this.topicModel.findOne({ name: topics[i] });
      let count = 0;
      for (let j = topic.pins.length - 1; j >= 0; j--) {
        if (count > 10) {
          break;
        }
        let pin = await this.pinModel.findById(topic.pins[j]);
        if (pin && !pins.includes(pin)) {
          pins.push(pin);
          count++;
        }
      }
    }
    console.log('5');

    for (let i = 0; i < user.pins.length; i++) {
      for (let j = 0; j < pins.length; j++) {
        if (String(pins[j]._id) == String(user.pins[i].pinId)) {
          pins.splice(j, 1);
        }
      }
    }
    console.log('6');
    for (let i = 0; i < user.savedPins.length; i++) {
      for (let j = 0; j < pins.length; j++) {
        if (String(pins[j]._id) == String(user.savedPins[i].pinId)) {
          pins.splice(j, 1);
        }
      }
    }
    pins = await this.shuffle(pins);
    let images = [];
    let count: number = 0;
    for (let i = 0; i < pins.length; i++) {
      if (count >= 5) break;
      if (pins[i].imageId) {
        count++;
        images.push(pins[i].imageId);
      }
    }
    await this.NotificationService.pinsForYou(user, pins, images);
    return pins;
  }
  async pinsInspired(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId);
    if (!user.pinsInspired) {
      throw new BadRequestException(
        'user should allow pins inspired by activity first',
      );
    }
    let topics = [];
    let names = [];
    let pins = [];
    for (let i = user.history.length - 1; i >= 0; i--) {
      let topic = await this.topicModel.findOne({
        name: user.history[i].topic,
      });
      if (!names.includes(topic.name)) {
        let count = 0;
        for (let j = 0; j < topic.pins.length; j++) {
          if (count > 30) break;
          let pin = await this.pinModel.findById(topic.pins[j]);
          if (pin && !pins.includes(pin)) {
            pins.push(pin);
            count++;
          }
        }
        names.push(topic.name);
      }
    }
    for (let i = user.history.length - 1; i >= 0; i--) {
      for (let j = 0; j < pins.length; j++) {
        if (String(pins[j]._id) == String(user.history[i].pinId)) {
          pins.splice(j, 1);
        }
      }
    }

    for (let i = 0; i < user.pins.length; i++) {
      for (let j = 0; j < pins.length; j++) {
        if (String(pins[j]._id) == String(user.pins[i].pinId)) {
          pins.splice(j, 1);
        }
      }
    }
    for (let i = 0; i < user.savedPins.length; i++) {
      for (let j = 0; j < pins.length; j++) {
        if (String(pins[j]._id) == String(user.savedPins[i].pinId)) {
          pins.splice(j, 1);
        }
      }
    }

    let images = [];
    let count: number = 0;
    for (let i = 0; i < pins.length; i++) {
      if (count >= 5) break;
      if (pins[i].imageId) {
        count++;
        images.push(pins[i].imageId);
      }
    }
    await this.NotificationService.pinsInspired(user, pins, images);
    return pins;
  }
}
