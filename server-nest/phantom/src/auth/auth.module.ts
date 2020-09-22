import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Email } from '../shared/send-email.service';
import { GoogleStrategy } from './google.strategy';
@Module({
  imports: [SharedModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, Email, GoogleStrategy],
})
export class AuthModule {}
