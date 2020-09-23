
const fs = require('fs');
if (!fs.existsSync('./.env')) {
  console.log('sorry the code will not run becouse you should create .env file')
  process.exit();
}
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cors = require('cors');
const logger = require('morgan');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger('dev', true));
  app.use(cors());
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
