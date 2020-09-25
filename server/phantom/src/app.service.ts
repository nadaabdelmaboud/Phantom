import { Injectable } from '@nestjs/common';
/**
 * @module App
 */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

