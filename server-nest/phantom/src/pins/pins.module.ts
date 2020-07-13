import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';

@Module({
  imports: [],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
