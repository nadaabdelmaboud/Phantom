import * as nestCommon from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../shared/user.service';
import { AuthService } from '../shared/auth.service';
import { Email } from '../shared/send-email.service';
import { UpdateDto } from './dto/update-user.dto';
import { NotAcceptableException } from '@nestjs/common';
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
  async resetPassword(
    @nestCommon.Request() req,
    @nestCommon.Query('newPassword') newPassword: string,
  ) {
    //  if (!req.user.email) throw new nestCommon.HttpException('Invalid token', nestCommon.HttpStatus.FORBIDDEN);
    const ifRest = await this.userService.resetPassword(
      req.user._id,
      newPassword,
    );
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/me/update')
  async updateUser(
    @nestCommon.Request() req,
    @nestCommon.Body() updateData: UpdateDto,
  ) {
    await this.userService.checkUpdateData(updateData);
    await this.userService.updateUserInfo(req.user._id, updateData);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/me/confirm-update-email')
  async confirmUpdateEmail(
    @nestCommon.Request() req,
    @nestCommon.Query('type') type: string,
  ) {
    if (!req.user.email || !req.user.newEmail || !req.user._id)
      throw new nestCommon.HttpException(
        'not correct token',
        nestCommon.HttpStatus.FORBIDDEN,
      );
    if (type === 'changeEmail') {
      const user = await this.userService.checkMAilExistAndFormat(
        req.user.email,
      );
      if (!user)
        throw new nestCommon.HttpException(
          'no user by this email',
          nestCommon.HttpStatus.FORBIDDEN,
        );
      await this.email.sendEmail(
        req.user.newEmail,
        req.header('Authorization'),
        'set email',
        req.user.firstName,
      );
    } else if (type === 'resetEmail') {
      const user = await this.userService.checkMAilExistAndFormat(
        req.user.newEmail,
      );
      if (user)
        throw new nestCommon.HttpException(
          'this email aleardy exists',
          nestCommon.HttpStatus.FORBIDDEN,
        );
      if (!(await this.userService.setEmail(req.user._id, req.user.newEmail)))
        throw new nestCommon.HttpException(
          'not user or not email',
          nestCommon.HttpStatus.BAD_REQUEST,
        );
    } else if (!type)
      throw new nestCommon.HttpException(
        'type mot correct',
        nestCommon.HttpStatus.FORBIDDEN,
      );
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/me/boards/view')
  async setViewState(
    @nestCommon.Request() req,
    @nestCommon.Query('viewState') viewState: string,
  ) {
    const view = await this.userService.setViewState(req.user._id, viewState);
    if (view) {
      return { success: 'view is updated' };
    } else {
      throw new NotAcceptableException('view is not updated');
    }
  }
  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/me/boards/view')
  async getViewState(@nestCommon.Request() req) {
    const view = await this.userService.getViewState(req.user._id);
    if (view) {
      return view;
    } else {
      throw new NotAcceptableException('cant get view state');
    }
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/me/follow-user/:user_id')
  async followUser(@nestCommon.Param() params, @nestCommon.Request() req) {
    if (!await this.userService.followUser(req.user._id, params.user_id))
      throw new nestCommon.BadRequestException('can not follow this user');
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Delete('/me/follow-user/:user_id')
  async unfollowUser(@nestCommon.Param() params, @nestCommon.Request() req) {
    if (!await this.userService.unfollowUser(req.user._id, params.user_id))
      throw new nestCommon.BadRequestException('can not follow this user');
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/me/follow-user/:user_id')
  async checkfollowingUser(@nestCommon.Param() params, @nestCommon.Request() req) {
    const user = await this.userService.getUserById(req.user._id);
    if (!await this.userService.checkFollowUser(user, params.user_id))
      return { 'follow': 'false' };
    else
      return { 'follow': 'true' };
  }

}
