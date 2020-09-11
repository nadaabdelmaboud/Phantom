import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Board } from '../models/board.schema';
import { Pin } from 'src/models/pin.schema';
import { SharedModule } from 'src/shared/shared.module';
import { Topic } from 'src/models/topic.schema';
import { User } from 'src/models/user.schema';

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
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
