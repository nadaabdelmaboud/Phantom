import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { User } from '../models/user.schema';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../shared/jwt.strategy';
import { ValidationService } from './validation.service';
import { SharedGateway } from './shared.gateway';
import { Pin } from 'src/models/pin.schema';
import { Email } from './send-email.service';
import { NotificationService } from '../notification/notification.service'
import { Topic } from '../models/topic.schema';
import { MongooseModule } from '@nestjs/mongoose';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: User },
      { name: 'Pin', schema: Pin },
      { name: 'Topic', schema: Topic },
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
