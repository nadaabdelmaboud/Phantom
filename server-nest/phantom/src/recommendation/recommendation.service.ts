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
import * as mongoose from 'mongoose';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<board>,
    @InjectModel('Pin') private readonly pinModel: Model<pin>,
    @InjectModel('Topic') private readonly topicModel: Model<topic>,
    @InjectModel('User') private readonly userModel: Model<user>,
    private UserService: UserService,
    private NotificationService: NotificationService,

    private ValidationService: ValidationService,
  ) {}

  async getHomeFeed(userId, limit: number, offset: number) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId, { homeFeed: 1 });
    if (!user) throw new Error('no such user');
    if (!user.homeFeed) user.homeFeed = [];

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
    let isPinInHome = {};
    let topics = [];
    let ALLUSERS = await this.userModel.find({}, { firstName: 1 });
    console.log('all users length', ALLUSERS.length);
    await this.userModel
      .update({ _id: userId }, { homeFeed: [] })
      .catch(err => {
        console.log(err);
      });
    let user = await this.userModel.findById(userId, {
      history: 1,
      followingTopics: 1,
      homeFeed: 1,
      boards: 1,
      lastTopics: 1,
    });
    if (!user) throw new Error('no such user');
    let homeFeedArr = [];

    if (user.lastTopics && user.lastTopics.length > 0) {
      for (let i = user.lastTopics.length - 1; i >= 0; i--) {
        let random = Math.floor(
          Math.random() * Number(user.lastTopics[i].pinsLength) + 1,
        );
        if (random + 15 >= Number(user.lastTopics[i].pinsLength)) {
          random = random - 15;
        }
        console.log(random + 15);
        let topic = await this.topicModel
          .findOne(
            { name: user.lastTopics[i].topicName },
            {
              pins: {
                $slice: [random, 15],
              },
            },
          )
          .lean();
        if (topic) {
          console.log('length');
          console.log(topic.pins.length);
          for (let j = 0; j < topic.pins.length; j++) {
            let pin = await this.pinModel.findById(topic.pins[j], {
              imageId: 1,
            });
            if (pin) {
              if (isPinInHome[String(pin._id)] != true) {
                homeFeedArr.push(pin);
                isPinInHome[String(pin._id)] = true;
              }
            }
          }

          await this.userModel
            .update({ _id: user._id }, { homeFeed: homeFeedArr })
            .catch(err => {
              console.log(err);
            });
        }
      }
    }

    if (!user.history) user.history = [];
    if (!user.followingTopics) user.followingTopics = [];
    for (let i = user.history.length - 1; i >= 0; i--) {
      topics.push(user.history[i].topic);
      if (!pinExist[String(user.history[i].pinId)])
        pinExist[String(user.history[i].pinId)] = true;
    }

    for (let i = user.followingTopics.length - 1; i >= 0; i--) {
      let followTopic = await this.topicModel
        .findById(user.followingTopics[i], { name: 1 })
        .lean();
      if (followTopic) {
        topics.push(followTopic.name);
      }
    }
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

    var freq = {};
    for (let i = 0; i < topics.length; i++) {
      if (topics[i] && topics[i] != undefined) {
        if (!freq[topics[i]]) {
          freq[topics[i]] = 0;
        }
        freq[topics[i]]++;
      }
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

    for (let i = 0; i < sortedTopics.length; i++) {
      let topic = await this.topicModel
        .findOne({ name: sortedTopics[i][0] }, { pins: 1 })
        .lean();
      let start = Math.floor(Math.random() * Number(topic.pins.length) + 1);
      if (start + 10 >= Number(topic.pins.length)) {
        start = start - 10;
      }
      for (let j = start; j < start + 10; j++) {
        if (
          pinExist[String(topic.pins[j])] == true ||
          isPinInHome[String(topic.pins[j])] == true
        ) {
          continue;
        }
        pinExist[String(topic.pins[j])] = true;
        isPinInHome[String(topic.pins[j])] = true;
        let pin = await this.pinModel
          .findById(topic.pins[j], {
            imageId: 1,
          })
          .lean();
        homeFeedArr.push(pin);
      }
      await this.userModel
        .update({ _id: userId }, { homeFeed: homeFeedArr })
        .catch(err => {
          console.log(err);
        });
    }

    if (homeFeedArr.length < 20) {
      let allTopics = await this.topicModel.find({}, { pins: 1 }).lean();
      for (let i = 0; i < allTopics.length; i++) {
        let start = Math.floor(
          Math.random() * Number(allTopics[i].pins.length) + 1,
        );
        if (start + 10 >= Number(allTopics[i].pins.length)) {
          start = start - 10;
        }
        for (let j = start; j < start + 10; j++) {
          if (
            pinExist[String(allTopics[i].pins[j])] == true ||
            isPinInHome[String(allTopics[i].pins[j])] == true
          ) {
            continue;
          }
          pinExist[String(allTopics[i].pins[j])] = true;
          isPinInHome[String(allTopics[i].pins[j])] = true;
          let pin = await this.pinModel
            .findById(allTopics[i].pins[j], {
              imageId: 1,
            })
            .lean();
          homeFeedArr.push(pin);
        }
        await this.userModel
          .update({ _id: userId }, { homeFeed: homeFeedArr })
          .catch(err => {
            console.log(err);
          });
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
    let topic = await this.topicModel
      .findOne({ name: topicName }, { recommendedUsers: 1 })
      .lean();
    let user = await this.userModel.findById(userId, { following: 1 }).lean();

    let followExist = {};
    for (let j = 0; j < user.following.length; j++) {
      followExist[String(user.following[j])] = true;
    }
    for (let i = 0; i < topic.recommendedUsers.length; i++) {
      if (
        String(topic.recommendedUsers[i]) != String(userId) &&
        followExist[String(topic.recommendedUsers[i])] != true
      ) {
        let recomUser = await this.userModel
          .aggregate()
          .match({ _id: topic.recommendedUsers[i] })
          .project({
            followers: { $size: '$followers' },
            profileImage: 1,
            firstName: 1,
            lastName: 1,
            google: 1,
            googleImage: 1,
          });
        followers.push(recomUser[0]);
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
    let user = await this.userModel.findById(userId, { following: 1 }).lean();
    let topUsers = await this.userModel
      .aggregate()
      .match({})
      .project({
        followers: { $size: '$followers' },
        profileImage: 1,
        firstName: 1,
        lastName: 1,
        google: 1,
        googleImage: 1,
      })
      .sort({ followers: -1 })
      .limit(70);
    let followExist = {};
    for (let j = 0; j < user.following.length; j++) {
      followExist[String(user.following[j])] = true;
    }

    for (let i = 0; i < topUsers.length; i++) {
      if (
        String(topUsers[i]._id) != String(userId) &&
        followExist[String(topUsers[i]._id)] != true
      ) {
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
    let user = await this.userModel.findById(userId, {
      history: 1,
      followingTopics: 1,
      following: 1,
    });
    if (!user) throw new Error('no such user');
    let followExist = {};
    let historyTopics = [];
    let followTopics = [];
    let topicTopics = [];
    let topics = [];
    for (let i = user.following.length - 1; i >= 0; i--) {
      followExist[String(user.following[i])] = true;
    }
    console.log('here 1');
    for (let i = user.history.length - 1; i >= 0; i--) {
      if (!topics.includes(user.history[i].topic)) {
        historyTopics.push(user.history[i].topic);
        topics.push(user.history[i].topic);
        if (historyTopics.length > 3) {
          break;
        }
      }
    }
    console.log('here 2');
    for (let i = user.followingTopics.length - 1; i >= 0; i--) {
      let topic = await this.topicModel.findById(user.followingTopics[i], {
        name: 1,
      });
      if (!topics.includes(topic.name)) {
        topics.push(topic.name);
        topicTopics.push(topic.name);
        if (topicTopics.length > 3) {
          break;
        }
      }
    }
    console.log('here 3');
    for (let i = user.following.length - 1; i >= 0; i--) {
      let follower = await this.userModel.findById(user.following[i], {
        followingTopics: 1,
      });
      for (let j = 0; j < follower.followingTopics.length; j++) {
        let topic = await this.topicModel.findById(
          follower.followingTopics[j],
          { name: 1 },
        );
        if (!topics.includes(topic.name)) {
          topics.push(topic.name);
          followTopics.push(topic.name);
          if (followTopics.length > 3) {
            break;
          }
        }
      }
    }

    let limit: number = topics.length > 5 ? 5 : 10;
    for (let i = 0; i < historyTopics.length; i++) {
      let topic = await this.topicModel.findOne(
        {
          name: String(historyTopics[i]),
        },
        { recommendedUsers: 1 },
      );
      let start = Math.floor(
        Math.random() * Number(topic.recommendedUsers.length) + 1,
      );
      if (start + limit >= Number(topic.recommendedUsers.length)) {
        start = start - limit;
        if (start < 0) {
          start = 0;
          if (start + limit >= Number(topic.recommendedUsers.length)) {
            limit = topic.recommendedUsers.length;
          }
        }
      }
      for (let j = start; j < start + limit; j++) {
        if (
          String(topic.recommendedUsers[j]) != String(userId) &&
          followExist[String(topic.recommendedUsers[j])] != true
        ) {
          let recomUser = await this.userModel
            .aggregate()
            .match({ _id: topic.recommendedUsers[j] })
            .project({
              followers: { $size: '$followers' },
              profileImage: 1,
              firstName: 1,
              lastName: 1,
              google: 1,
              googleImage: 1,
            });
          followers.push({
            user: recomUser[0],
            recommendType: 'based on your recent activity',
          });
          followExist[String(topic.recommendedUsers[j])] = true;
        }
      }
    }
    console.log('here 5');
    for (let i = 0; i < topicTopics.length; i++) {
      let topic = await this.topicModel.findOne(
        {
          name: String(topicTopics[i]),
        },
        { recommendedUsers: 1 },
      );
      let start = Math.floor(
        Math.random() * Number(topic.recommendedUsers.length) + 1,
      );
      if (start + limit >= Number(topic.recommendedUsers.length)) {
        start = start - limit;
        if (start < 0) {
          start = 0;
          if (start + limit >= Number(topic.recommendedUsers.length)) {
            limit = topic.recommendedUsers.length;
          }
        }
      }
      for (let j = start; j < start + limit; j++) {
        if (
          String(topic.recommendedUsers[j]) != String(userId) &&
          followExist[String(topic.recommendedUsers[j])] != true
        ) {
          let recomUser = await this.userModel
            .aggregate()
            .match({ _id: topic.recommendedUsers[j] })
            .project({
              followers: { $size: '$followers' },
              profileImage: 1,
              firstName: 1,
              lastName: 1,
              google: 1,
              googleImage: 1,
            });
          followers.push({
            user: recomUser[0],
            recommendType: 'based on your interest',
          });
          followExist[String(topic.recommendedUsers[j])] = true;
        }
      }
    }
    console.log('here 6');
    for (let i = 0; i < followTopics.length; i++) {
      let topic = await this.topicModel.findOne(
        {
          name: String(followTopics[i]),
        },
        { recommendedUsers: 1 },
      );
      let start = Math.floor(
        Math.random() * Number(topic.recommendedUsers.length) + 1,
      );
      if (start + limit >= Number(topic.recommendedUsers.length)) {
        start = start - limit;
        if (start < 0) {
          start = 0;
          if (start + limit >= Number(topic.recommendedUsers.length)) {
            limit = topic.recommendedUsers.length;
          }
        }
      }
      for (let j = start; j < start + limit; j++) {
        if (
          String(topic.recommendedUsers[j]) != String(userId) &&
          followExist[String(topic.recommendedUsers[j])] != true
        ) {
          let recomUser = await this.userModel
            .aggregate()
            .match({ _id: topic.recommendedUsers[j] })
            .project({
              followers: { $size: '$followers' },
              profileImage: 1,
              firstName: 1,
              lastName: 1,
              google: 1,
              googleImage: 1,
            });
          followers.push({
            user: recomUser[0],
            recommendType: 'based on people you follow',
          });

          followExist[String(topic.recommendedUsers[j])] = true;
        }
      }
    }
    console.log('wee2');
    let topUsers = await this.userModel
      .aggregate()
      .match({})
      .project({
        followers: { $size: '$followers' },
        profileImage: 1,
        firstName: 1,
        lastName: 1,
        google: 1,
        googleImage: 1,
      })
      .sort({ followers: -1 })
      .limit(20);
    console.log('wee');
    for (let i = 0; i < topUsers.length; i++) {
      if (
        String(topUsers[i]._id) != String(userId) &&
        followExist[String(topUsers[i]._id)] != true
      ) {
        followers.push({
          user: topUsers[i],
          recommendType: 'popular on phantom',
        });
        followExist[String(topUsers[i]._id)] = true;
      }
    }
    console.log(followers.length);
    return followers;
  }
  async pinMoreLike(userId, pinId) {
    if ((await this.ValidationService.checkMongooseID([userId, pinId])) == 0)
      throw new Error('not valid id');
    await this.pinModel.update({ _id: pinId }, { more: [] }).catch(err => {
      console.log(err);
    });
    let pin = await this.pinModel.findById(pinId, {
      topic: 1,
      title: 1,
      note: 1,
      more: 1,
    });
    if (!pin) throw new Error('no such user');
    let topic = await this.topicModel
      .findOne({ name: pin.topic }, { pins: 1 })
      .lean();
    let pins = [];
    let pinExist = {};

    if (topic) {
      let start = Math.floor(Math.random() * Number(topic.pins.length) + 1);
      if (start == topic.pins.length) {
        start--;
      }
      let counter = start;
      console.log(topic.pins.length);
      while (true) {
        if (String(topic.pins[counter]) != String(pinId)) {
          let pinTopic = await this.pinModel
            .findById(topic.pins[counter], { imageId: 1 })
            .lean();
          if (pinTopic) {
            if (pinExist[String(pinTopic._id)] != true) {
              pins.push(pinTopic);
              await this.pinModel
                .update({ _id: pinId }, { more: pins })
                .catch(err => {
                  console.log(err);
                });
            }
            pinExist[String(pinTopic._id)] = true;
          }
        }
        counter++;
        if (counter >= topic.pins.length) {
          counter = 0;
        }
        if (counter == start) {
          break;
        }
      }
    }
    let allpins = await this.pinModel.find({}, { title: 1, note: 1 });
    for (let i = allpins.length - 1; i >= 0; i--) {
      if (
        (allpins[i].note &&
          (allpins[i].note.includes(String(pin.title)) ||
            allpins[i].note.includes(String(pin.note)))) ||
        allpins[i].title.includes(String(pin.title)) ||
        allpins[i].title.includes(String(pin.note))
      ) {
        if (pinExist[String(allpins[i]._id)] != true) {
          pins.push(allpins[i]);
          await this.pinModel
            .update({ _id: pinId }, { more: pins })
            .catch(err => {
              console.log(err);
            });
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }
    return { total: pins.length };
  }
  async boardMoreLike(userId, boardId) {
    if ((await this.ValidationService.checkMongooseID([userId, boardId])) == 0)
      throw new Error('not valid id');
    await this.boardModel.update({ _id: boardId }, { more: [] }).catch(err => {
      console.log(err);
    });
    let board = await this.boardModel.findById(boardId, {
      more: 1,
      topic: 1,
      pins: 1,
      name: 1,
    });
    if (!board) throw new Error('no such user');

    let pins = [];
    let pinExist = {};
    let topics = [];
    let start = Math.floor(Math.random() * Number(board.pins.length) + 1);
    if (start == board.pins.length) {
      start--;
    }
    let counter = start;
    console.log(board.pins.length);
    let f = 0;
    while (true && counter < board.pins.length) {
      console.log(f);
      console.log(board.pins[counter].topic);
      if (!topics.includes(board.pins[counter].topic)) {
        topics.push(board.pins[counter].topic);
      }
      counter++;
      if (counter >= board.pins.length) {
        counter = 0;
      }
      if (counter == start) {
        break;
      }
      f++;
    }
    if (board.topic && board.topic != '') {
      topics.push(board.topic);
    }
    let limit = 50;
    console.log(topics.length);
    for (let i = 0; i < topics.length; i++) {
      let topic = await this.topicModel.findOne(
        { name: topics[i] },
        { pins: 1 },
      );
      if (topic) {
        let start = Math.floor(Math.random() * Number(topic.pins.length) + 1);
        if (start + limit >= Number(topic.pins.length)) {
          start = start - limit;
          if (start < 0) {
            start = 0;
          }
        }
        for (let j = start; j < start + limit; j++) {
          if (j < topic.pins.length) {
            let pinTopic = await this.pinModel.findById(topic.pins[j], {
              imageId: 1,
            });
            if (pinTopic) {
              if (pinExist[String(pinTopic._id)] != true) {
                pins.push(pinTopic);
                await this.boardModel
                  .update({ _id: boardId }, { more: pins })
                  .catch(err => {
                    console.log(err);
                  });
              }
              pinExist[String(pinTopic._id)] = true;
            }
          }
        }
      }
    }

    let allpins = await this.pinModel.find(
      {},
      { imageId: 1, title: 1, note: 1 },
    );
    for (let i = 0; i < allpins.length; i++) {
      if (
        (allpins[i].note && allpins[i].note.includes(String(board.name))) ||
        allpins[i].title.includes(String(board.name))
      ) {
        if (pinExist[String(allpins[i]._id)] != true) {
          pins.push(allpins[i]);
          await this.boardModel
            .update({ _id: boardId }, { more: pins })
            .catch(err => {
              console.log(err);
            });
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }
    console.log(pins.length);
    console.log('ohayo');
    if (pins.length < 10) {
      let allTopics = await this.topicModel.find({}, { pins: 1 }).lean();
      for (let i = 0; i < allTopics.length; i++) {
        let start = Math.floor(
          Math.random() * Number(allTopics[i].pins.length) + 1,
        );
        if (start + 3 >= Number(allTopics[i].pins.length)) {
          start = start - 3;
        }
        for (let j = start; j < start + 3; j++) {
          if (pinExist[String(allTopics[i].pins[j])] == true) {
            continue;
          }
          pinExist[String(allTopics[i].pins[j])] = true;
          let pin = await this.pinModel
            .findById(allTopics[i].pins[j], {
              imageId: 1,
            })
            .lean();
          pins.push(pin);
        }
        await this.boardModel
          .update({ _id: boardId }, { more: pins })
          .catch(err => {
            console.log(err);
          });
      }
    }
    return { total: pins.length };
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

    let board = await this.boardModel.findById(boardId, { sections: 1 });
    if (!board) throw new Error('no such board');
    let pins = [];
    let pinExist = {};
    let sectionIndex = null;
    for (let k = 0; k < board.sections.length; k++) {
      if (String(sectionId) == String(board.sections[k]._id)) {
        sectionIndex = k;
        board.sections[k].more = [];
        await board.save();
        break;
      }
    }
    if (!sectionIndex) {
      throw new NotFoundException('no section');
    }

    let topics = [];
    let start = Math.floor(
      Math.random() * Number(board.sections[sectionIndex].pins.length) + 1,
    );
    if (start == board.sections[sectionIndex].pins.length) {
      start--;
    }
    let counter = start;
    console.log(board.sections[sectionIndex].pins.length);
    while (true && counter < board.sections[sectionIndex].pins.length) {
      if (!topics.includes(board.sections[sectionIndex].pins[counter].topic)) {
        topics.push(board.sections[sectionIndex].pins[counter].topic);
      }
      counter++;
      if (counter >= board.sections[sectionIndex].pins.length) {
        counter = 0;
      }
      if (counter == start) {
        break;
      }
    }

    let limit = 50;
    for (let i = 0; i < topics.length; i++) {
      let topic = await this.topicModel.findOne(
        { name: topics[i] },
        { pins: 1 },
      );
      if (topic) {
        let start = Math.floor(Math.random() * Number(topic.pins.length) + 1);
        if (start + limit >= Number(topic.pins.length)) {
          start = start - limit;
          if (start < 0) {
            start = 0;
          }
        }
        for (let j = start; j < start + limit; j++) {
          if (j < topic.pins.length) {
            let pinTopic = await this.pinModel.findById(topic.pins[j], {
              imageId: 1,
            });
            if (pinTopic) {
              if (pinExist[String(pinTopic._id)] != true) {
                pins.push(pinTopic);
                board.sections[sectionIndex].more.push(pinTopic);
                await board.save();
              }
              pinExist[String(pinTopic._id)] = true;
            }
          }
        }
      }
    }

    let allpins = await this.pinModel.find(
      {},
      { imageId: 1, title: 1, note: 1 },
    );
    for (let i = 0; i < allpins.length; i++) {
      if (
        (allpins[i].note && allpins[i].note.includes(String(board.name))) ||
        allpins[i].title.includes(String(board.name))
      ) {
        if (pinExist[String(allpins[i]._id)] != true) {
          pins.push(allpins[i]);
          board.sections[sectionIndex].more.push(allpins[i]);
          await board.save();
        }
        pinExist[String(allpins[i]._id)] = true;
      }
    }
    if (pins.length < 10) {
      let allTopics = await this.topicModel.find({}, { pins: 1 }).lean();
      for (let i = 0; i < allTopics.length; i++) {
        let start = Math.floor(
          Math.random() * Number(allTopics[i].pins.length) + 1,
        );
        if (start + 3 >= Number(allTopics[i].pins.length)) {
          start = start - 3;
        }
        for (let j = start; j < start + 3; j++) {
          if (pinExist[String(allTopics[i].pins[j])] == true) {
            continue;
          }
          pinExist[String(allTopics[i].pins[j])] = true;
          let pin = await this.pinModel
            .findById(allTopics[i].pins[j], {
              imageId: 1,
            })
            .lean();
          pins.push(pin);
          board.sections[sectionIndex].more.push(pin);
          await board.save();
        }
      }
    }
    return { total: pins.length };
  }
  async getPinMoreLike(pinId, limit, offset) {
    if ((await this.ValidationService.checkMongooseID([pinId])) == 0)
      throw new Error('not valid id');
    let pin = await this.pinModel.findById(pinId, { more: 1 }).lean();
    if (!pin) throw new Error('no such pin');
    if (!pin.more) pin.more = [];
    console.log(pin.more.length);
    console.log(offset + limit);
    if (Number(Number(offset) + Number(limit)) > pin.more.length) {
      throw new NotFoundException('invalid offset limit || not enough data');
    }
    return pin.more.slice(
      Number(offset),
      Number(Number(offset) + Number(limit)),
    );
  }
  async getBoardMoreLike(boardId, offset, limit) {
    if ((await this.ValidationService.checkMongooseID([boardId])) == 0)
      throw new Error('not valid id');
    let board = await this.boardModel.findById(boardId, { more: 1 }).lean();
    if (!board) throw new Error('no such board');
    if (!board.more) board.more = [];
    if (Number(Number(offset) + Number(limit)) > board.more.length) {
      throw new NotFoundException('invalid offset limit || not enough data');
    }

    return board.more.slice(
      Number(offset),
      Number(Number(offset) + Number(limit)),
    );
  }
  async getSectionMoreLike(boardId, sectionId, offset, limit) {
    if (
      (await this.ValidationService.checkMongooseID([boardId, sectionId])) == 0
    )
      throw new Error('not valid id');
    let board = await this.boardModel.findById(boardId, { sections: 1 });
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
        return board.sections[i].more.slice(
          Number(offset),
          Number(Number(offset) + Number(limit)),
        );
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
    let allBoards = await this.boardModel
      .find(
        {},
        {
          topic: 1,
          name: 1,
          counts: 1,
          description: 1,
          coverImages: 1,
          creator: 1,
        },
      )
      .lean();
    for (let i = 0; i < user.boards.length; i++) {
      let count = 0;
      for (let j = allBoards.length - 1; j >= 0; j--) {
        if (count == 10) break;
        if (String(allBoards[j]._id) != String(user.boards[i].boardId)) {
          let board = await this.boardModel
            .findById(user.boards[i].boardId, {
              name: 1,
              topic: 1,
              description: 1,
            })
            .lean();
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
                for (let index = 0; index < boards.length; index++) {
                  let boardUser = await this.userModel.findById(
                    boards[index].creator.id,
                    { email: 1 },
                  );
                  if (
                    String(boardUser.email) == String(process.env.ADMIN_EMAIL)
                  ) {
                    boards.splice(index, 1);
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
      let topic = await this.topicModel
        .findById(user.followingTopics[i], {
          name: 1,
        })
        .lean();
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
              for (let index = 0; index < boards.length; index++) {
                let boardUser = await this.userModel.findById(
                  boards[index].creator.id,
                  { email: 1 },
                );
                if (
                  String(boardUser.email) == String(process.env.ADMIN_EMAIL)
                ) {
                  boards.splice(index, 1);
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
      let following = await this.userModel
        .findById(user.following[i], {
          boards: 1,
        })
        .lean();
      for (let j = 0; j < following.boards.length; j++) {
        let board = await this.boardModel
          .findById(following.boards[j].boardId, {
            topic: 1,
            name: 1,
            counts: 1,
            description: 1,
            coverImages: 1,
            creator: 1,
          })
          .lean();
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
            for (let index = 0; index < boards.length; index++) {
              let boardUser = await this.userModel.findById(
                boards[index].creator.id,
                { email: 1 },
              );
              if (String(boardUser.email) == String(process.env.ADMIN_EMAIL)) {
                boards.splice(index, 1);
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
    for (let index = 0; index < boards.length; index++) {
      let boardUser = await this.userModel.findById(boards[index].creator.id, {
        email: 1,
      });
      if (String(boardUser.email) == String(process.env.ADMIN_EMAIL)) {
        boards.splice(index, 1);
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
    if (boards.length > 0) {
      let res = await this.NotificationService.boardsForYou(
        user,
        boards,
        images,
      );
    }
    return 1;
  }
  async popularPins(userId, isSearch) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId, {
      pins: 1,
      savedPins: 1,
      popularPins: 1,
    });
    if (!user.popularPins) {
      throw new BadRequestException('user should allow popular pins first');
    }
    let allPins = await this.pinModel
      .find({}, { imageId: 1 })
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
    if (!isSearch) {
      let images = [];
      let count: number = 0;
      for (let i = 0; i < allPins.length; i++) {
        if (count >= 5) break;
        if (allPins[i].imageId) {
          count++;
          images.push(allPins[i].imageId);
        }
      }

      let res = await this.NotificationService.popularPins(
        user,
        allPins,
        images,
      );
      return true;
    }
    console.log('here2');
    let random = Math.floor(Math.random() * 100 + 1);
    if (random + 5 >= 100) {
      random = random - 5;
    }
    return allPins.slice(random, random + 5);
  }
  async pinsForYou(userId, isSearch) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId, {
      pins: 1,
      savedPins: 1,
      followingTopics: 1,
      pinsForYou: 1,
    });
    if (!user.pinsForYou) {
      throw new BadRequestException('user should allow pins for you first');
    }
    let topics = [];
    let pins = [];
    console.log('1');
    for (let i = user.followingTopics.length - 1; i >= 0; i--) {
      let topic = await this.topicModel.findById(user.followingTopics[i], {
        name: 1,
      });
      if (topic && !topics.includes(String(topic.name))) {
        topics.push(String(topic.name));
      }
    }
    for (let i = user.pins.length - 1; i >= 0; i--) {
      let pin = await this.pinModel.findById(user.pins[i].pinId, { topic: 1 });
      if (pin && !topics.includes(String(pin.topic))) {
        topics.push(String(pin.topic));
      }
    }
    console.log('2');
    for (let i = user.savedPins.length - 1; i >= 0; i--) {
      let pin = await this.pinModel.findById(user.savedPins[i].pinId, {
        topic: 1,
      });
      if (pin && !topics.includes(String(pin.topic))) {
        topics.push(String(pin.topic));
      }
    }
    console.log('3');

    console.log('4');
    for (let i = 0; i < topics.length; i++) {
      let topic = await this.topicModel.findOne(
        { name: topics[i] },
        { pins: 1 },
      );
      if (topic) {
        let start = Math.floor(Math.random() * Number(topic.pins.length) + 1);
        if (start + 10 >= Number(topic.pins.length)) {
          start = start - 10;
        }
        for (let j = start; j < start + 10; j++) {
          let pin = await this.pinModel.findById(topic.pins[j], { imageId: 1 });
          if (pin && !pins.includes(pin)) {
            pins.push(pin);
          }
        }
      }
    }
    console.log('5');
    if (pins.length < 10) {
      let allTopics = await this.topicModel.find({}, { pins: 1 }).lean();
      for (let i = 0; i < allTopics.length; i++) {
        let start = Math.floor(
          Math.random() * Number(allTopics[i].pins.length) + 1,
        );
        if (start + 10 >= Number(allTopics[i].pins.length)) {
          start = start - 10;
        }
        for (let j = start; j < start + 10; j++) {
          let pin = await this.pinModel
            .findById(allTopics[i].pins[j], {
              imageId: 1,
            })
            .lean();
          if (pin && !pins.includes(pin)) {
            pins.push(pin);
          }
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
    console.log('6');
    for (let i = 0; i < user.savedPins.length; i++) {
      for (let j = 0; j < pins.length; j++) {
        if (String(pins[j]._id) == String(user.savedPins[i].pinId)) {
          pins.splice(j, 1);
        }
      }
    }
    if (!isSearch) {
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
      return true;
    }
    let random = Math.floor(Math.random() * pins.length + 1);
    if (random + 5 >= pins.length) {
      random = random - 5;
    }
    return pins.slice(random, random + 5);
  }
  async pinsInspired(userId, isSearch) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0)
      throw new Error('not valid id');
    let user = await this.userModel.findById(userId);
    if (!user.pinsInspired) {
      throw new BadRequestException(
        'user should allow pins inspired by activity first',
      );
    }

    let pins = [];
    if (user.lastTopics && user.lastTopics.length > 0) {
      for (let i = user.lastTopics.length - 1; i >= 0; i--) {
        let random = Math.floor(
          Math.random() * Number(user.lastTopics[i].pinsLength) + 1,
        );
        if (random + 15 >= Number(user.lastTopics[i].pinsLength)) {
          random = random - 15;
        }
        let topic = await this.topicModel
          .findOne(
            { name: user.lastTopics[i].topicName },
            {
              pins: {
                $slice: [random, 15],
              },
            },
          )
          .lean();
        if (topic) {
          for (let j = 0; j < topic.pins.length; j++) {
            let pin = await this.pinModel.findById(topic.pins[j], {
              imageId: 1,
            });
            if (pin) {
              pins.push(pin);
            }
          }
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
    if (!isSearch && pins.length > 0) {
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
      return true;
    }
    let random = Math.floor(Math.random() * pins.length + 1);
    if (random + 5 >= pins.length) {
      random = random - 5;
    }
    return pins.slice(random, random + 5);
  }
}
