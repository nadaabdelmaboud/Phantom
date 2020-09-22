import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { user } from '../types/user';
import { chat } from '../types/chat';
import { ValidationService } from '../shared/validation.service';
import { message } from 'src/types/message';
@Injectable()
export class ChatService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<user>,
    @InjectModel('Chat') private readonly chatModel: Model<chat>,
    @InjectModel('Message') private readonly messageModel: Model<message>,

    private ValidationService: ValidationService,
  ) {}
  async sendMessage(senderId: String, recieverIds: String[], text: String) {
    if (!this.ValidationService.checkMongooseID([senderId, recieverIds[0]]))
      throw new Error('not mongoose id');
    let mess = { userId: senderId, message: text, date: new Date() };
    let ids = recieverIds.concat(senderId);
    let chat = await this.chatModel.findOneAndUpdate(
      { usersIds: { $all: ids, $size: ids.length } },
      { $set: { lastMessage: mess } },
    );
    if (!chat) {
      chat = new this.chatModel({
        usersIds: ids,
        lastMessage: mess,
        date: new Date(),
      });
      await chat.save();
    }
    let message = new this.messageModel({
      chatId: chat._id,
      senderId: senderId,
      message: text,
      date: mess.date,
    });
    await message.save();
    return message._id;
  }
  async getMessage(userIds: String[], senderId: String) {
    if (!this.ValidationService.checkMongooseID(userIds))
      throw new Error('not mongoose id');
    let ids = userIds.concat(senderId);
    let chat = await this.chatModel.findOne({ usersIds: { $all: ids } }, '_id');

    if (!chat) return 0;
    return await this.messageModel.find(
      { chatId: chat._id },
      'message date seenStatus deliverStatus senderId',
      { sort: { date: -1 } },
    );
  }
  //id userName imageId
  async getChats(userId: String) {
    if (!this.ValidationService.checkMongooseID([userId]))
      throw new Error('not mongoose id');
    let chat = await this.chatModel.find(
      { usersIds: userId },
      'usersIds lastMessage',
      { sort: { 'lastMessage.date': -1 } },
    );
    let arr = [];
    let result = [];
    chat.map(conv => {
      conv.usersIds.map(user => {
        if (String(user) != String(userId)) arr.push(user);
      });
    });
    for (let i = 0; i < arr.length; i++)
      result.push({
        ...(await this.userModel
          .findOne({ _id: arr[i] }, 'profileImage userName google googleImage')
          .lean()),
        lastMessage: chat[i].lastMessage,
      });
    return result;
  }
  async deliver(userId: String, messageId: string, isDelivered: boolean) {
    if (!this.ValidationService.checkMongooseID([userId, messageId]))
      throw new Error('not mongoose id');

    if (isDelivered)
      await this.messageModel.findOneAndUpdate(
        {
          _id: messageId,
          senderId: { $ne: userId },
          deliverStatus: { $not: { $elemMatch: { userId: userId } } },
        },
        {
          $push: {
            deliverStatus: { userId: userId, time: new Date() },
          },
        },
      );
    return 1;
  }
  async seen(userId: String, messageId: string, isSeen: boolean) {
    if (!this.ValidationService.checkMongooseID([userId, messageId]))
      throw new Error('not mongoose id');

    if (isSeen)
      await this.messageModel.findOneAndUpdate({ _id: messageId, senderId: { $ne: userId }, seenStatus: { $not: { $elemMatch: { userId: userId } } } }, {
        $push: {
          seenStatus: { userId: userId, time: new Date() }
        }
      });
    return 1;
  }
  async seenMessage(
    senderId: String,
    recieverId: String,
    time: string,
    isSeen: boolean,
  ) {
    if (!this.ValidationService.checkMongooseID([senderId, recieverId]))
      throw new Error('not mongoose id');
    let chat = await this.chatModel.findOne(
      { usersIds: { $all: [senderId, recieverId] } },
      '_id',
    );

    if (isSeen)
      return await this.messageModel.updateMany(
        {
          chatId: chat._id,
          date: { $lt: new Date(time) },
          senderId: { $ne: recieverId },
          seenStatus: { $not: { $elemMatch: { userId: recieverId } } },
        },
        {
          $push: {
            seenStatus: { userId: recieverId, time: new Date() },
          },
        },
      );
  }

  async findUsers(userId: string) {
    if (!this.ValidationService.checkMongooseID([userId]))
      throw new Error('not mongoose id');
    return await this.userModel.find(
      { _id: userId, 'sentMessages.userId': mongoose.Types.ObjectId(userId) },
      'userName profileImage sentMessages.message',
    );
  }
  async getMessagesSent(firstUserId: string, secondUserId: string) {
    if (!this.ValidationService.checkMongooseID([firstUserId, secondUserId]))
      throw new Error('not mongoose id');
    const toUser = await this.userModel.findById(firstUserId, {
      sentMessages: 1,
    });
    const fromUser = await this.userModel.findById(secondUserId, {
      userName: 1,
    });
    if (!toUser || !fromUser) throw new UnauthorizedException();
    if (!toUser.sentMessages) toUser.sentMessages = [];
    for (let i = 0; i < toUser.sentMessages.length; i++) {
      if (String(toUser.sentMessages[i].userId) == String(secondUserId)) {
        return toUser.sentMessages[i].message;
      }
    }
  }

  async sentMessage(senderId, recieverId, message) {
    if (!this.ValidationService.checkMongooseID([senderId, recieverId]))
      throw new Error('not mongoose id');
    const sender = await this.userModel.findById(senderId);
    const reciever = await this.userModel.findById(recieverId);
    if (!sender || !reciever) throw new UnauthorizedException();
    if (!sender.sentMessages) {
      sender.sentMessages = [];
    }
    for (let i = 0; i < sender.sentMessages.length; i++) {
      if (String(sender.sentMessages[i].userId) == String(recieverId)) {
        sender.sentMessages[i].message.push({
          note: message,
          time: new Date(),
        });
        await sender.save();
        return 1;
      }
    }
    sender.sentMessages.push({
      message: [{ note: message, time: new Date() }],
      userId: recieverId,
    });
    await sender.save();
    return 1;
  }
}
