import { Controller, Post, Body } from '@nestjs/common';
import { createPinDto } from './dto/create-pin.dto';
@Controller('pins')
export class PinsController {
  @Post()
  createPin(@Body() createPinDto: createPinDto): String {
    return createPinDto.note;
  }
}
