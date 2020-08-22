import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { User } from '../models/user.schema';
import { Chat } from '../models/chat.schema';

import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from 'src/shared/shared.module';
@Module({
    imports: [
        SharedModule,
        MongooseModule.forFeature([
          { name: 'User', schema: User },
          { name: 'Chat', schema: Chat }
        ]),
      ],
      controllers: [ChatController],
      providers: [ChatService],
      exports:[ChatService]
})
export class ChatModule {}
