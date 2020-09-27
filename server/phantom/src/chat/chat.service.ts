import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
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
  /**
* @author Dina Alaa <dinaalaaaahmed@gmail.com>
* @descriptionget send message
* @param {String} senderId -sender id 
* @param {Array<String>} recieverIds -reciever ids
* @param {String} text -name
* @returns {String} -message id
*/
  async sendMessage(senderId: String, recieverIds: String[], text: String): Promise<String> {
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
  /**
* @author Dina Alaa <dinaalaaaahmed@gmail.com>
* @descriptionget get messages
* @param {String} senderId -sender id 
* @param {Array<String>} userIds -user ids
* @returns {Array<Object>|0} -message objects | 0
*/
  async getMessage(userIds: String[], senderId: String): Promise<Array<message> | 0> {
    if (!this.ValidationService.checkMongooseID(userIds))
      throw new Error('not mongoose id');
    let ids = userIds.concat(senderId);
    let chat = await this.chatModel.findOne({ usersIds: { $all: ids, $size: ids.length } }, '_id');
    if (!chat) return 0;
    return await this.messageModel.find(
      { chatId: chat._id },
      'message date seenStatus deliverStatus senderId',
      { sort: { date: -1 } },
    );
  }
  /**
* @author Dina Alaa <dinaalaaaahmed@gmail.com>
* @descriptionget get chats
* @param {String} userId -user id 
* @returns {Array<Object>} -chat objects
*/
  async getChats(userId: String): Promise<Array<Object>> {
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
  /**
* @author Dina Alaa <dinaalaaaahmed@gmail.com>
* @descriptionget deliver message
* @param {String} userId -user id 
* @param {String} messageId -message id
* @returns {Object} -message object
*/
  async deliver(userId: String, messageId: string): Promise<message> {
    if (!this.ValidationService.checkMongooseID([userId, messageId]))
      throw new Error('not mongoose id');
    return await this.messageModel.findOneAndUpdate(
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
  }
  /**
* @author Dina Alaa <dinaalaaaahmed@gmail.com>
* @descriptionget seen message
* @param {String} userId -user id 
* @param {String} messageId -message id
* @returns {Object} -message object
*/
  async seen(userId: String, messageId: string): Promise<message> {
    if (!this.ValidationService.checkMongooseID([userId, messageId]))
      throw new Error('not mongoose id');

    return await this.messageModel.findOneAndUpdate(
      {
        _id: messageId,
        senderId: { $ne: userId },
        seenStatus: { $not: { $elemMatch: { userId: userId } } }
      },
      {
        $push: {
          seenStatus: { userId: userId, time: new Date() }
        }
      });
  }
  /**
* @author Dina Alaa <dinaalaaaahmed@gmail.com>
* @descriptionget seen messages before timeStamp
* @param {String} senderId -sender id 
* @param {String} recieverId -reciever id 
* @param {String} time -time
* @returns {Boolean} 
*/
  async seenMessage(
    senderId: String,
    recieverId: String,
    time: string
  ): Promise<Boolean> {
    if (!this.ValidationService.checkMongooseID([senderId, recieverId]))
      throw new Error('not mongoose id');
    let chat = await this.chatModel.findOne(
      { usersIds: { $all: [senderId, recieverId], $size: 2 } },
      '_id',
    );
    await this.messageModel.updateMany(
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
    return true;
  }


}
