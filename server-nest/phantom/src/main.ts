import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');
const logger = require('morgan');
const mongoose = require('mongoose');
/* const myMongoosePlugin = require('mongoosastic');
mongoose.plugin(myMongoosePlugin, {
  hosts: ['localhost:9200'],
}); */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger('dev', true));
  app.use(cors());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT);
}
bootstrap();
