import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PinsModule } from './pins/pins.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { BoardModule } from './board/board.module';
import { ImagesService } from './images/images.service';
import { ImagesModule } from './images/images.module';
import { TopicModule } from './topic/topic.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.CONNECTION_STRING),
    PinsModule,
    BoardModule,
    ImagesModule,
    TopicModule,
    SharedModule,
    AuthModule,
    UserModule,
    SearchModule,
    ChatModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatService],
})
export class AppModule { }
