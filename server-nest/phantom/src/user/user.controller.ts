import * as nestCommon from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../shared/user.service';
import { AuthService } from '../shared/auth.service';
import { Email } from '../shared/send-email.service'
import { UpdateDTO } from './dto/update-user.dto';
@nestCommon.Controller()
export class UserController {
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private email: Email,
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

    @nestCommon.UseGuards(AuthGuard('jwt'))
    @nestCommon.Put('/me/update')
    async updateUser(@nestCommon.Request() req, @nestCommon.Body() updateData: UpdateDTO) {
        await this.userService.checkUpdateData(updateData);
        await this.userService.updateUserInfo(req.user._id, updateData);

    }

    @nestCommon.UseGuards(AuthGuard('jwt'))
    @nestCommon.Put('/me/confirm-update-email')
    async confirmUpdateEmail(@nestCommon.Request() req, @nestCommon.Query('type') type: string,) {
        if (!req.user.email || !req.user.newEmail || !req.user._id)
            throw new nestCommon.HttpException('not correct token', nestCommon.HttpStatus.FORBIDDEN);
        if (type === 'changeEmail') {
            const user = await this.userService.checkMAilExistAndFormat(req.user.email);
            if (!user) throw new nestCommon.HttpException('no user by this email', nestCommon.HttpStatus.FORBIDDEN);
            await this.email.sendEmail(req.user.newEmail, req.header('Authorization'), 'set email', req.user.firstName)
        }
        if (type === 'resetEmail') {
            const user = await this.userService.checkMAilExistAndFormat(req.user.newEmail);
            if (user) throw new nestCommon.HttpException('this email aleardy exists', nestCommon.HttpStatus.FORBIDDEN);
            if (! await this.userService.setEmail(req.user._id, req.user.newEmail))
                throw new nestCommon.HttpException('not user or not email', nestCommon.HttpStatus.BAD_REQUEST);

        }
    }


}
