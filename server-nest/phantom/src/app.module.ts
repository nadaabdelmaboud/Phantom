import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImagesController } from './images/images.controller';
import { PinsModule } from './pins/pins.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot(process.env.CONNECTION_STRING), PinsModule],
  controllers: [AppController, ImagesController],
  providers: [AppService],
})
export class AppModule {}
