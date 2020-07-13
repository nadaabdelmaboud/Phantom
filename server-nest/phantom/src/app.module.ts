import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PinsModule } from './pins/pins.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardModule } from './board/board.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    PinsModule,
    BoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
