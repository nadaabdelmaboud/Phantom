import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { UserController } from './user.controller';
import { AuthService } from '../shared/auth.service';
import { JwtStrategy } from '../shared/jwt.strategy';
import { Email } from '../shared/send-email.service'
@Module({
    imports: [SharedModule],
    controllers: [UserController],
    providers: [AuthService, JwtStrategy, Email],
})
export class UserModule { }
