import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { Pin } from '../models/pin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../shared/user.module';
import { BoardModule } from '../board/board.module';
import { ImagesModule } from '../images/images.module';
import { Topic } from 'src/models/topic.schema';
import { PinsModule } from '../pins/pins.module';

@Module({
  imports: [
    UserModule,
    ImagesModule,
    BoardModule,
    PinsModule,
    MongooseModule.forFeature([
      { name: 'Topic', schema: Topic },
      { name: 'Pin', schema: Pin },
    ])    
  ],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}