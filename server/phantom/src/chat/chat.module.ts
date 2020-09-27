import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { User } from '../models/user.schema';
import { Chat } from '../models/chat.schema';
import { SharedGateway } from '../shared/shared.gateway';

import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../shared/shared.module';
import { Message } from 'src/models/message.schema';
@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: 'User', schema: User },
      { name: 'Chat', schema: Chat },
      { name: 'Message', schema: Message },

    ]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule { }
