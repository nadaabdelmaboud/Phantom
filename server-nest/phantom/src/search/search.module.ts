import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Pin } from '../models/pin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '../board/board.module';
import { ImagesModule } from '../images/images.module';
import { PinsModule } from '../pins/pins.module';
import { SharedModule } from '../shared/shared.module';
import { Board } from '../models/board.schema';
import { User } from '../models/user.schema';
import { UserModule } from '../user/user.module';
import * as search from 'fuzzy-search';
@Module({
  imports: [
    SharedModule,
    ImagesModule,
    UserModule,
    BoardModule,
    PinsModule,
    MongooseModule.forFeature([
      { name: 'Board', schema: Board },
      { name: 'Pin', schema: Pin },
      { name: 'User', schema: User },
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
