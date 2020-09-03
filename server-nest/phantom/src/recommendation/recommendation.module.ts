import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { Board } from '../models/board.schema';
import { Pin } from 'src/models/pin.schema';
import { SharedModule } from 'src/shared/shared.module';
import { Topic } from 'src/models/topic.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/models/user.schema';
import { BoardModule } from 'src/board/board.module';
import { PinsModule } from 'src/pins/pins.module';

@Module({
  imports: [
    SharedModule,
    BoardModule,
    PinsModule,
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
