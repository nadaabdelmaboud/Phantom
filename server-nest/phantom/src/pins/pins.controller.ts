import {
  Controller,
  Post,
  Body,
  UseFilters,
  ForbiddenException,
} from '@nestjs/common';
import { createPinDto } from './dto/create-pin.dto';
import { HttpExceptionFilter } from '../shared/http-exception.filter';

@UseFilters(new HttpExceptionFilter())
@Controller('pins')
export class PinsController {
  @Post()
  createPin(@Body() createPinDto: createPinDto): String {
    if (createPinDto.note == 'nada') {
      return 'done';
    } else {
      throw new ForbiddenException({ message: 'you are not nada' });
    }
  }
}
