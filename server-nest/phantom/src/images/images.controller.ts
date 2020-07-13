import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('images')
export class ImagesController {
  @Post()
  uploadImage() {}
}
