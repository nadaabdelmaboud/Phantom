import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Board } from '../models/board.schema';
import { UserModule } from '../shared/user.module';
import { Pin } from 'src/models/pin.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'Board', schema: Board },
      { name: 'Pin', schema: Pin },
    ]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
