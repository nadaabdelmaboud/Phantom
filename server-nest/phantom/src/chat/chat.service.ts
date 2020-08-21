import {
    Injectable,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Model } from 'mongoose';
  import { InjectModel } from '@nestjs/mongoose';
  import * as mongoose from 'mongoose';
  import { user } from '../types/user';

  import { ValidationService } from '../shared/validation.service';
@Injectable()
export class ChatService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<user>,
        private ValidationService: ValidationService,
      ) {}
      async getMessagesSent(firstUserId: string, secondUserId: string) {
        if (!this.ValidationService.checkMongooseID([firstUserId, secondUserId]))
        throw new Error('not mongoose id');
        const toUser = await this.userModel.findById(firstUserId);
        const fromUser = await this.userModel.findById(secondUserId);
        if (!toUser||!fromUser)
          new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        return await (await this.userModel.findById(firstUserId)).sentMessages.find(o => o.userId === mongoose.Types.ObjectId(secondUserId)).message;
      }
      async getMessagesRecieved(firstUserId: string, secondUserId: string) {
        if (!this.ValidationService.checkMongooseID([firstUserId, secondUserId]))
        throw new Error('not mongoose id');
        const toUser = await this.userModel.findById(firstUserId);
        const fromUser = await this.userModel.findById(secondUserId);
        if (!toUser||!fromUser)
          new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
        return await (await this.userModel.findById(firstUserId)).recievedMessages.find(o => o.userId === mongoose.Types.ObjectId(secondUserId)).message;
      }
      async sentMessage(senderId, recieverId, message) {
        if (!this.ValidationService.checkMongooseID([senderId, recieverId]))
        throw new Error('not mongoose id');
        const sender = await this.userModel.findById(senderId);
        const reciever = await this.userModel.findById(recieverId);
        if (!sender||!reciever)
          new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED)
        if(!sender.sentMessages){
            sender.sentMessages = []
        }
        if(!reciever.recievedMessages){
            reciever.recievedMessages = []
        }
        let sentMessages = await (sender.sentMessages.find(o=>o.userId === recieverId))
        if(sentMessages) sentMessages.message.push({note:message, time:new Date()})
        else sender.sentMessages.push({message:[{note:message, time:new Date()}],userId:recieverId})
        await sender.save();
        let recievedMessages = await (reciever.recievedMessages.find(o=>o.userId === senderId))
        if(recievedMessages) recievedMessages.message.push({note:message, time:new Date()})
        else reciever.recievedMessages.push({message:[{note:message, time:new Date()}],userId:recieverId})
        await reciever.save();
        return 1;
      }


}
