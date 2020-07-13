import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller';
import { PinsService } from './pins.service';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
@Module({
  imports: [HttpExceptionFilter],
  controllers: [PinsController],
  providers: [PinsService],
})
export class PinsModule {}
