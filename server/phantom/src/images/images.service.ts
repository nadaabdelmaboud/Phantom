import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as credentials from './credentials.json';
import { Readable } from 'stream';

const scopes = ['https://www.googleapis.com/auth/drive'];
const fs = require('fs');
const gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);
const { google } = require('googleapis');

@Injectable()
export class ImagesService {
  public drive;
  constructor() {
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      scopes,
    );
    this.drive = google.drive({ version: 'v3', auth });
  }
  async deleteFile(id) {
    this.drive.files
      .delete({
        fileId: id,
      })
      .then(
        async function(response) {
          return { status: 'success' };
        },
        function(err) {
          throw new NotFoundException();
        },
      );
  }

  async uploadFile(fileName, mimeType, stream) {
    const readable = new Readable();
    readable._read = () => {};
    readable.push(stream);
    readable.push(null);
    var fileMetadata = {
      name: fileName,
    };
    var media = {
      mimeType: mimeType,
      body: readable,
    };
    let res = await this.drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    if (res) {
      return { id: res.data.id };
    } else {
      throw new BadRequestException();
    }
  }
}
