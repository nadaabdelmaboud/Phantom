import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Pin } from '../models/pin.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from '../board/board.module';
import { ImagesModule } from '../images/images.module';
import { PinsModule } from '../pins/pins.module';
import { SharedModule } from 'src/shared/shared.module';
import { Board } from 'src/models/board.schema';
import { User } from 'src/models/user.schema';
import { UserModule } from 'src/user/user.module';
import {FuzzySearch} from 'fuzzy-search'
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
