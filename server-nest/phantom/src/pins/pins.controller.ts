import {
  Controller,
  Post,
  Body,
  UseFilters,
  ForbiddenException,
} from '@nestjs/common';
import { createPinDto } from './dto/create-pin.dto';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { PinsService } from './pins.service';

@UseFilters(new HttpExceptionFilter())
@Controller('pins')
export class PinsController {
  constructor(private PinsService: PinsService) {}
  @Post()
  async createPin(@Body() createPinDto: createPinDto) {
    if (createPinDto.note == 'nada') {
      return await this.PinsService.getPins();
    } else {
      throw new ForbiddenException({ message: 'you are not nada' });
    }
  }
}
