import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';
import { FileInfoVm } from './file-info-vm.model';
import { response } from 'express';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { fstat } from 'fs';
import { error } from 'console';

@Injectable()
export class ImagesService {
  private fileModel: MongoGridFS;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.fileModel = new MongoGridFS(this.connection.db, 'images');
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }
  async checkImage(id: string): Promise<Boolean> {
    let isFound = true;
    let im = await this.fileModel.findById(id).catch(err => {
      isFound = false;
    });
    if (isFound) {
      return true;
    } else {
      return false;
    }
  }
  async findInfo(id: string) {
    const result = await this.fileModel
      .findById(id);
      if(!result||result==undefined){return;}
      
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      md5: result.md5,
      contentType: result.contentType,
    };
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this.fileModel.delete(id);
  }
}
