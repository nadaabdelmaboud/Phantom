import {
    Injectable,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Model } from 'mongoose';
  import { InjectModel } from '@nestjs/mongoose';
  import * as mongoose from 'mongoose';
  import { user } from '../types/user';
  import { chat } from '../types/chat';

  import { ValidationService } from '../shared/validation.service';
import { from } from 'rxjs';
@Injectable()
export class ChatService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<user>,
        @InjectModel('Chat') private readonly chatModel: Model<chat>,

        private ValidationService: ValidationService,
      ) {}
      async getMessagesSent(firstUserId: string, secondUserId: string) {
        if (!this.ValidationService.checkMongooseID([firstUserId, secondUserId]))
        throw new Error('not mongoose id');
        const toUser = await this.userModel.findById(firstUserId);
        const fromUser = await this.userModel.findById(secondUserId);
        if (!toUser||!fromUser)
          new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);

        for( let i=0;i<toUser.sentMessages.length;i++){


          if(String(toUser.sentMessages[i].userId) == String(secondUserId)){
            return toUser.sentMessages[i].message
          }
             

        }
  
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
        for( let i=0;i<sender.sentMessages.length;i++){
          if(String(sender.sentMessages[i].userId) == String(recieverId)){
            sender.sentMessages[i].message.push({note:message, time:new Date()})
            await sender.save();
            return 1;
          }
        }
        sender.sentMessages.push({message:[{note:message, time:new Date()}],userId:recieverId})
        
      }


}
