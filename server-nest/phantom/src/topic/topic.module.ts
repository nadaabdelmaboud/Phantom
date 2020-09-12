import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { Pin } from '../models/pin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '../board/board.module';
import { ImagesModule } from '../images/images.module';
import { Topic } from '../models/topic.schema';
import { PinsModule } from '../pins/pins.module';
import { SharedModule } from '../shared/shared.module';
import { User } from '../models/user.schema';

@Module({
  imports: [
    SharedModule,
    ImagesModule,
    BoardModule,
    PinsModule,
    MongooseModule.forFeature([
      { name: 'Topic', schema: Topic },
      { name: 'Pin', schema: Pin },
      {name: 'User', schema:User}
    ]),
  ],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
