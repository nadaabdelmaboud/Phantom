import {
  Controller,
  Post,
  Body,
  UseFilters,
  ForbiddenException,
  NotAcceptableException,
} from '@nestjs/common';
import { createPinDto } from './dto/create-pin.dto';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
import { PinsService } from './pins.service';
import { ImagesService } from '../images/images.service';
@UseFilters(new HttpExceptionFilter())
@Controller()
export class PinsController {
  constructor(
    private PinsService: PinsService,
    private ImagesService: ImagesService,
  ) {}
  @Post('/me/pins')
  async createPin(@Body() createPinDto: createPinDto) {
    let userId = '5ef10225f775502d20121345';
    let createdPin = await this.PinsService.createPin(userId, createPinDto);
    if (createdPin) {
      return createdPin;
    } else {
      await this.ImagesService.deleteFile(createPinDto.imageId.toString());
      throw new NotAcceptableException({ message: 'pin is not created' });
    }
  }
}
