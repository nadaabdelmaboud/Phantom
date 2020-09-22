import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Email } from '../shared/send-email.service';
import { BoardService } from '../board/board.service';
import { TopicService } from '../topic/topic.service';
import { Pin } from '../models/pin.schema';
import { Board } from '../models/board.schema';
import { Topic } from '../models/topic.schema';
import { UserService } from './user.service';
import { User } from 'src/models/user.schema';
import { Message } from 'src/models/message.schema';
import { Chat } from 'src/models/chat.schema';
@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: 'User', schema: User },
      { name: 'Pin', schema: Pin },
      { name: 'Board', schema: Board },
      { name: 'Topic', schema: Topic },
      { name: 'Message', schema: Message },
      { name: 'Chat', schema: Chat },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
