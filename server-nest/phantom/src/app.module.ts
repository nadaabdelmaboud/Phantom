import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PinsModule } from './pins/pins.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { BoardModule } from './board/board.module';
import { ImagesModule } from './images/images.module';
import { TopicModule } from './topic/topic.module';
import { UserModule } from './user/user.module';
import { SearchModule } from './search/search.module';
import { ChatModule } from './chat/chat.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    RecommendationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'client/dist'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
