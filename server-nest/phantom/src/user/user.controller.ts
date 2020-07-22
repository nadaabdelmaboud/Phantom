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
        const user = await this.userService.getUserById(req.user._id);
        user.password = undefined;
        return { user };
    }

    @nestCommon.Get('/user/:user_id')
    async getUser(@nestCommon.Param() params) {
        const user = await this.userService.getUserById(params.user_id);
        user.password = undefined;
        return { user };
    }

    @nestCommon.UseGuards(AuthGuard('jwt'))
    @nestCommon.Put('/me/reset-password')
    async resetPassword(@nestCommon.Request() req, @nestCommon.Query('newPassword') newPassword: string,) {
        //  if (!req.user.email) throw new nestCommon.HttpException('Invalid token', nestCommon.HttpStatus.FORBIDDEN);
        const ifRest = await this.userService.resetPassword(req.user._id, newPassword);
    }



}
