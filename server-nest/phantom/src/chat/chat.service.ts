import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
  ) { }
  async sendMessage(senderId: String, recieverIds: String[], text: String, name: String) {
    if (!this.ValidationService.checkMongooseID([senderId]))
      throw new Error('not mongoose id');
    if (!this.ValidationService.checkMongooseID(recieverIds))
      throw new Error('not mongoose id');
    let mess = { userId: senderId, message: text, date: new Date() }
    let ids = recieverIds.concat(senderId)
    var user;
    if (!name) {
      user = await this.userModel.findById(senderId, 'userName');
      name = user.userName;
    }
    let chat = await this.chatModel.findOneAndUpdate({ usersIds: { $all: ids } }, { $set: { lastMessage: mess } });
    if (!chat) {
      chat = new this.chatModel({
        usersIds: ids, lastMessage: mess, date: new Date(), name: name
      })
      await chat.save()
    }
    let message = new this.messageModel({ chatId: chat._id, senderId: senderId, message: text, date: mess.date })
    await message.save()
    return { message, chat };

  }
  async getMessage(userIds: String[], senderId: String) {
    if (!this.ValidationService.checkMongooseID(userIds))
      throw new Error('not mongoose id');
    let ids = userIds.concat(senderId)
    let chat = await this.chatModel.findOne({ usersIds: ids }, '_id');
    return await this.messageModel.find({ chatId: chat._id }, 'message date seenStatus deliverStatus senderId', { sort: { date: -1 } })
  }
  //id userName imageId
  async getChats(userId: String) {
    if (!this.ValidationService.checkMongooseID([userId]))
      throw new Error('not mongoose id');
    let chat = await this.chatModel.find({ usersIds: userId }, 'usersIds lastMessage', { sort: { date: -1 } });
    let arr = []
    chat.map(conv => {
      conv.usersIds.map(user => {
        if (String(user) != String(userId))
          arr.push(user)
      })
    })
    let users = await this.userModel.find({ _id: { $in: arr } }, 'profileImage userName');
    return users.map((x, index) => {
      return {
        _id: x._id, profileImage: x.profileImage, userName: x.userName,
        lastMessage: chat[index].lastMessage
      }
    })

  }

  async seenDeliverMessage(userId: String, messageId: String, isSeen: boolean, isDelivered: boolean) {
    if (!this.ValidationService.checkMongooseID([userId, messageId]))
      throw new Error('not mongoose id');
    if (isSeen)
      await this.messageModel.findOneAndUpdate({ _id: messageId, senderId: { $ne: userId } }, {
        $push: {
          seenStatus: { userId: userId, time: new Date() }
        }
      });
    if (isDelivered)
      await this.messageModel.findOneAndUpdate({ _id: messageId, senderId: { $ne: userId } }, {
        $push: {
          deliverStatus: { userId: userId, time: new Date() }
        }
      });
    return 1;

  }

  async findUsers(userId: string) {
    if (!this.ValidationService.checkMongooseID([userId]))
      throw new Error('not mongoose id');
    return await this.userModel.find({ _id: userId, 'sentMessages.userId': mongoose.Types.ObjectId(userId) }, 'userName profileImage sentMessages.message');

  }
  async getMessagesSent(firstUserId: string, secondUserId: string) {
    if (!this.ValidationService.checkMongooseID([firstUserId, secondUserId]))
      throw new Error('not mongoose id');
    const toUser = await this.userModel.findById(firstUserId);
    const fromUser = await this.userModel.findById(secondUserId);
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
