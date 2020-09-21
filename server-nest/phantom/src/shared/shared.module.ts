import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { User } from '../models/user.schema';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { ValidationService } from './validation.service';
import { SharedGateway } from './shared.gateway';
import { Pin } from '../models/pin.schema';
import { Board } from '../models/board.schema';
import { Email } from './send-email.service';
import { NotificationService } from '../notification/notification.service';
import { Topic } from '../models/topic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Message } from 'src/models/message.schema';
import { Chat } from 'src/models/chat.schema';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: User },
      { name: 'Pin', schema: Pin },
      { name: 'Board', schema: Board },
      { name: 'Topic', schema: Topic },
      { name: 'Message', schema: Message },
      { name: 'Chat', schema: Chat },

    ]),
  ],
  providers: [
    UserService,
    SharedGateway,
    ValidationService,
    AuthService,
    JwtStrategy,
    Email,
    NotificationService,
    ChatService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [UserService, ValidationService, AuthService, Email],
})
export class SharedModule { }
