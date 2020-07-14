import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pin } from '../models/pin.schema';
import { UserService } from '../shared/user.service';
import { UserModule } from '../shared/user.module';
import { BoardModule } from '../board/board.module';
import { ImagesModule } from '../images/images.module';
import { Board } from 'src/models/board.schema';
@Module({
  imports: [
    UserModule,
    ImagesModule,
    BoardModule,
    MongooseModule.forFeature([
      { name: 'Pin', schema: Pin },
      { name: 'Board', schema: Board },
    ]),
  ],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
