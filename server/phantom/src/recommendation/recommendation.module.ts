import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { Board } from '../models/board.schema';
import { Pin } from '../models/pin.schema';
import { SharedModule } from '../shared/shared.module';
import { Topic } from '../models/topic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from '../models/user.schema';
import { BoardModule } from '../board/board.module';
import { PinsModule } from '../pins/pins.module';
import { NotificationService } from '../shared/notification.service';

@Module({
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: 'Board', schema: Board },
      { name: 'Pin', schema: Pin },
      { name: 'Topic', schema: Topic },
      { name: 'User', schema: User },
    ]),
  ],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
