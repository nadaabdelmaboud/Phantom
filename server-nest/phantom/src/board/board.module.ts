import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Board } from '../models/board.schema';
import { UserModule } from '../shared/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Board', schema: Board }]),
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
