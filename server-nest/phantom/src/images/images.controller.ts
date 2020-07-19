import {
  Post,
  Get,
  Param,
  Res,
  Controller,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
  HttpException,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiConsumes,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { FileResponseVm } from './file-response-vm..model';
var path=require('path');
@Controller()
export class ImagesController {
  constructor(private filesService: ImagesService) {}
  @Post('/me/uploadImage')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('file'))
  upload(@UploadedFiles() files) {
    const response = [];
    files.forEach(file => {
      const fileReponse = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        id: file.id,
        filename: file.filename,
        metadata: file.metadata,
        bucketName: file.bucketName,
        chunkSize: file.chunkSize,
        size: file.size,
        md5: file.md5,
        uploadDate: file.uploadDate,
        contentType: file.contentType,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get('imageInfo/:id')
  @ApiBadRequestResponse({ type: BadRequestException })
  async getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }

  @Get('/image/:id')
  async getFile(@Param('id') id: string, @Res() res) {
    const checkImage = await this.filesService.checkImage(id);
    if (!checkImage) {
      var filePath = "./default.jpg"
      var resolvedPath =await path.resolve(filePath);
      return res.sendFile(resolvedPath);
    }
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      const imgPath = path.join(__dirname, '/../static/default.jpg');
      return res.sendFile(imgPath);
    }
    res.header('Content-Type', file.contentType);
    return filestream.pipe(res);
  }

  @Get('download/:id')
  @ApiBadRequestResponse({ type: BadRequestException })
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @Delete('image/:id')
  @ApiBadRequestResponse({ type: BadRequestException })
  @ApiCreatedResponse({ type: FileResponseVm })
  async deleteFile(@Param('id') id: string): Promise<FileResponseVm> {
    const file = await this.filesService.findInfo(id);
    const filestream = await this.filesService.deleteFile(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: file,
    };
  }
}
