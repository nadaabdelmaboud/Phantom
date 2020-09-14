import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../shared/shared.module';
import { UserController } from './user.controller';
import { AuthService } from '../shared/auth.service';
import { JwtStrategy } from '../shared/jwt.strategy';
import { Email } from '../shared/send-email.service';
import { BoardService } from '../board/board.service';
import { TopicService } from '../topic/topic.service';
import { Pin } from '../models/pin.schema';
import { Board } from '../models/board.schema';
import { Topic } from '../models/topic.schema';
@Module({
    imports: [SharedModule],
    controllers: [UserController],
    providers: [AuthService, JwtStrategy, Email],
})
export class UserModule { }
