import * as nestCommon from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PinsService } from '../pins/pins.service';
import { BoardService } from '../board/board.service';
import { TopicService } from '../topic/topic.service';
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
  /*  private TopicService: TopicService,
    private BoardService: BoardService,
    private PinsService: PinsService,
    */private email: Email,
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
    const user = await this.userService.getActivateUserById(params.user_id);
    user.password = undefined;
    return { user };
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/me/reset-password')
  async resetPassword(
    @nestCommon.Request() req,
    @nestCommon.Body('newPassword') newPassword: string,
    @nestCommon.Body('oldPassword') oldPassword: string,
    @nestCommon.Body('forgetPassword') forgetPassword: Boolean,
  ) {
    if (forgetPassword == true)
      oldPassword = undefined;
    else if (!oldPassword)
      throw new nestCommon.HttpException(
        'oldPassword is reqired',
        nestCommon.HttpStatus.FORBIDDEN,
      );
    const ifRest = await this.userService.resetPassword(
      req.user._id,
      newPassword,
      oldPassword
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
    const user = await this.userService.getUserById(req.user._id);
    user.password = undefined;
    return user;
  }


  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/me/update-settings')
  async updateUserSettings(
    @nestCommon.Request() req,
    @nestCommon.Body() updateData,
  ) {/*
    if (updateData.deleteflag) {
      const user = await this.userService.getUserById(req.user._id);
      // delete boards created saved
      for (let i = 0; i < user.boards.length; i++) {
        await this.BoardService.deleteBoard(req.user._id, user.boards[i].boardId);
      }
      for (let i = 0; i < user.pins.length; i++) {
        await this.PinsService.deletePin(req.user._id, user.pins[i].pinId);
      }
      // delete following
      //delete followers 
      // delete pins saved created
    }*/
    await this.userService.updateSettings(req.user._id, updateData);
    const user = await this.userService.getUserById(req.user._id);
    user.password = undefined;
    return user;
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
    if (!(await this.userService.followUser(req.user._id, params.user_id)))
      throw new nestCommon.BadRequestException('can not follow this user');
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Delete('/me/follow-user/:user_id')
  async unfollowUser(@nestCommon.Param() params, @nestCommon.Request() req) {
    if (!(await this.userService.unfollowUser(req.user._id, params.user_id)))
      throw new nestCommon.BadRequestException('can not follow this user');
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/me/:fcmToken')
  async setFCMToken(
    @nestCommon.Param() params,
    @nestCommon.Request() req,
  ) {
    const user = await this.userService.updateFCMTocken(params.fcmToken, req.user._id);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Put('/log-out')
  async logOut(
    @nestCommon.Request() req,
  ) {
    const user = await this.userService.updateFCMTocken(' ', req.user._id);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/me/follow-user/:user_id')
  async checkfollowingUser(
    @nestCommon.Param() params,
    @nestCommon.Request() req,
  ) {
    const user = await this.userService.getUserById(req.user._id);
    if (!(await this.userService.checkFollowUser(user, params.user_id)))
      return { follow: 'false' };
    else return { follow: 'true' };
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/me/follower')
  async getFollowers(
    @nestCommon.Request() req,
    @nestCommon.Query('limit') limit: Number,
    @nestCommon.Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowers(req.user._id, limit, offset);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/me/following')
  async getFollowings(
    @nestCommon.Request() req,
    @nestCommon.Query('limit') limit: Number,
    @nestCommon.Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowings(req.user._id, limit, offset);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/:user_id/follower')
  async getUserFollowers(
    @nestCommon.Request() req,
    @nestCommon.Param() params,
    @nestCommon.Query('limit') limit: Number,
    @nestCommon.Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowers(params.user_id, limit, offset);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/:user_id/following')
  async getUserFollowings(
    @nestCommon.Request() req,
    @nestCommon.Param() params,
    @nestCommon.Query('limit') limit: Number,
    @nestCommon.Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowings(params.user_id, limit, offset);
  }
}
