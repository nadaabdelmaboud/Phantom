import { Module } from '@nestjs/common';

import { SharedModule } from '../shared/shared.module';
import { UserController } from './user.controller';
import { Email } from '../shared/send-email.service'
@Module({
    imports: [SharedModule],
    controllers: [UserController],
    providers: [Email],
})
export class UserModule { }
