/*Acknowledgment
this module is inspired by  https://medium.com/@khoa.phan.9xset/nestjs-file-uploading-using-multer-gridfs-7569a1b48022
*/
import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from '../shared/user.service';
import { UserModule } from '../shared/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { GridFsMulterConfigService } from './multer-config.service';
@Module({
  imports: [
    UserModule,
    MulterModule.registerAsync({
      useClass: GridFsMulterConfigService,
    }),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, GridFsMulterConfigService],
})
export class ImagesModule {}
