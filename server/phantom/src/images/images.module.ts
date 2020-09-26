import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { SharedModule } from '../shared/shared.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Topic } from 'src/models/topic.schema';

@Module({
  imports: [SharedModule,  MongooseModule.forFeature([
    { name: 'Topic', schema: Topic },
  ]),],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
