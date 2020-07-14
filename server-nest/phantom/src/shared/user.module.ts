import { Module } from '@nestjs/common';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/models/user.schema';
import { UserService } from './user.service';
import { ValidationService } from './validation.service';
@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: User }])],
  controllers: [],
  providers: [UserService, ValidationService],
  exports: [UserService, ValidationService],
})
export class UserModule {}
