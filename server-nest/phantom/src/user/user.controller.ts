import * as nestCommon from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../shared/user.service';
import { AuthService } from '../shared/auth.service';
import { Email } from '../shared/send-email.service'
@nestCommon.Controller()
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private Email: Email,
    ) { }


    @nestCommon.UseGuards(AuthGuard('jwt'))
    @nestCommon.Get('/me')
    async me(@nestCommon.Request() req) {
        /* const { password, ...result } = req.user._doc;*/
        const user = await this.userService.getUserById(req.user._id);
        user.password = undefined;
        return { user };
    }
}
