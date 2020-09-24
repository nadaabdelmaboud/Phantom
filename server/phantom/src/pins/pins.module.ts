import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pin } from '../models/pin.schema';
import { BoardModule } from '../board/board.module';
import { ImagesModule } from '../images/images.module';
import { Board } from '../models/board.schema';
import { SharedModule } from '../shared/shared.module';
import { Topic } from '../models/topic.schema';
import { NotificationService } from '../shared/notification.service';
import { User } from '../models/user.schema';

@Module({
  imports: [
    SharedModule,
    BoardModule,
    ImagesModule,
    MongooseModule.forFeature([
      { name: 'Pin', schema: Pin },
      { name: 'Board', schema: Board },
      { name: 'Topic', schema: Topic },
      { name: 'User', schema: User },
    ]),
  ],
  controllers: [PinsController],
  providers: [PinsService],
  exports: [PinsService],
})
export class PinsModule {}
