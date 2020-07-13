import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const logger = require('morgan');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(logger('dev'));
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT);
}
bootstrap();
