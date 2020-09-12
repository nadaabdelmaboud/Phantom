/*Acknowledgment
this module is inspired by  https://medium.com/@khoa.phan.9xset/nestjs-file-uploading-using-multer-gridfs-7569a1b48022
*/
import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer-config.service';
import { SharedModule } from '../shared/shared.module';
@Module({
  imports: [
    SharedModule,
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, GridFsMulterConfigService],
  exports: [ImagesService],
})
export class ImagesModule {}
