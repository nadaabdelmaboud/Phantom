import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from '../models/user.schema';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggingInterceptor } from './logging.interceptor';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../shared/jwt.strategy';
import { ValidationService } from './validation.service';
import { SharedGateway } from './shared.gateway';
import { Pin } from 'src/models/pin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: User },
      { name: 'Pin', schema: Pin },
    ]),
  ],
  providers: [
    UserService,
    SharedGateway,
    ValidationService,
    AuthService,
    JwtStrategy,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [UserService, ValidationService],
})
export class SharedModule { }
