import {
  Post,
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  Request,
  UploadedFiles,
  UseFilters,
} from '@nestjs/common';
import { ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { HttpExceptionFilter } from 'src/shared/http-exception.filter';
const path = require('path');

@UseFilters(HttpExceptionFilter)
@Controller()
export class ImagesController {
  constructor(private ImagesService: ImagesService) {}

  @Post('/me/uploadImage')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadImage(@UploadedFiles() files, @Request() req) {
    return await this.ImagesService.uploadFile(
      files[0].originalname,
      files[0].mimetype,
      files[0].buffer,
    );
  }

  @Get('/image/:id')
  async getImage(@Param('id') id: string, @Res() response, @Request() req) {
    if (!id || id == ' ' || id == '' || id == 'none' || id == 'null') {
      var filePath = './src/static/default.jpg';
      var resolvedPath = await path.resolve(filePath);
      return response.sendFile(resolvedPath);
    }
    await this.ImagesService.drive.files.get(
      { fileId: id, alt: 'media' },
      { responseType: 'stream' },
      function(err, res) {
        if (err) {
          console.log(err);
          var filePath = './src/static/default.jpg';
          var resolvedPath = path.resolve(filePath);
          return response.sendFile(resolvedPath);
        }
        res.data
          .on('end', () => {})
          .on('error', err => {
            var filePath = './src/static/default.jpg';
            var resolvedPath = path.resolve(filePath);
            return response.sendFile(resolvedPath);
          })
          .pipe(response);
      },
    );
  }
}
