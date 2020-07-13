import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pin } from '../models/pin.schema';
import { UserService } from '../shared/user.service';
import { UserModule } from '../shared/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: 'Pin', schema: Pin }]),
  ],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
