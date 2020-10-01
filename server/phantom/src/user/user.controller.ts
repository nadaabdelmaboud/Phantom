import {
  Controller,
  Get,
  Body,
  Put,
  Request,
  Delete,
  HttpStatus,
  HttpException,
  Query,
  UseGuards,
  Param,
  BadRequestException,
  NotAcceptableException,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Email } from '../shared/send-email.service';
import { UpdateSettingsDto } from './dto/update-user-settings.dto';
import { UpdateDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from '../shared/http-exception.filter';
@UseFilters(HttpExceptionFilter)
@Controller()
export class UserController {
  constructor(private userService: UserService, private email: Email) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('users/me')
  async me(@Request() req) {
    const user = await this.userService.getUserMe(req.user._id);

    return user;
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('notifications/me')
  async getNotifications(@Request() req) {
    const user = await this.userService.getUserNotifications(req.user._id);
    return user;
  }
  @Get('/user/:id')
  async getUser(@Param() params) {
    const user = await this.userService.getUserMe(params.id);
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/reset-password')
  async resetPassword(
    @Request() req,
    @Body('newPassword') newPassword: string,
    @Body('oldPassword') oldPassword: string,
    @Body('forgetPassword') forgetPassword: Boolean,
  ) {
    if (forgetPassword == true) oldPassword = null;
    else if (!oldPassword)
      throw new HttpException('oldPassword is reqired', HttpStatus.FORBIDDEN);
    const ifRest = await this.userService.resetPassword(
      req.user._id,
      newPassword,
      oldPassword,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/update')
  async updateUser(@Request() req, @Body() updateData: UpdateDto) {
    await this.userService.checkUpdateData(updateData);
    await this.userService.updateUserInfo(req.user._id, updateData);
    const user = await this.userService.getUserMe(req.user._id);
    user.password = null;
    return user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/update-settings')
  async updateUserSettings(
    @Request() req,
    @Body() updateData: UpdateSettingsDto,
  ) {
    if (updateData.notificationCounter)
      return await this.userService.updateDataInUser(req.user._id, {
        notificationCounter: 0,
      });
    await this.userService.updateSettings(req.user._id, updateData);
    if (!updateData.deleteFlag) {
      const user = await this.userService.getUserMe(req.user._id);
      user.password = null;
      return user;
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Put('/me/confirm-update-email')
  async confirmUpdateEmail(@Request() req, @Query('type') type: string) {
    if (!req.user.email || !req.user.newEmail || !req.user._id)
      throw new HttpException('not correct token', HttpStatus.FORBIDDEN);
    if (type === 'changeEmail') {
      const user = await this.userService.checkMAilExistAndFormat(
        req.user.email,
      );
      if (!user)
        throw new HttpException('no user by this email', HttpStatus.FORBIDDEN);
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
        throw new HttpException(
          'this email aleardy exists',
          HttpStatus.FORBIDDEN,
        );
      if (!(await this.userService.setEmail(req.user._id, req.user.newEmail)))
        throw new HttpException(
          'not user or not email',
          HttpStatus.BAD_REQUEST,
        );
    } else if (!type)
      throw new HttpException('type not correct', HttpStatus.FORBIDDEN);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/boards/view')
  async setViewState(@Request() req, @Query('viewState') viewState: string) {
    const view = await this.userService.setViewState(req.user._id, viewState);
    if (view) {
      return { success: 'view is updated' };
    } else {
      throw new NotAcceptableException('view is not updated');
    }
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/me/boards/view')
  async getViewState(@Request() req) {
    const view = await this.userService.getViewState(req.user._id);
    if (view) {
      return view;
    } else {
      throw new NotAcceptableException('cant get view state');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/follow-user/:userId')
  async followUser(@Param() params, @Request() req) {
    if (!(await this.userService.followUser(req.user._id, params.userId)))
      throw new BadRequestException('can not follow this user');
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/follow-user/:userId')
  async unfollowUser(@Param() params, @Request() req) {
    if (!(await this.userService.unfollowUser(req.user._id, params.userId)))
      throw new BadRequestException('can not follow this user');
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/me/:fcmToken')
  async setFCMToken(@Param() params, @Request() req) {
    const user = await this.userService.updateFCMTocken(
      params.fcmToken,
      req.user._id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/log-out')
  async logOut(@Request() req) {
    const user = await this.userService.updateFCMTocken(' ', req.user._id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me/follow-user/:userId')
  async checkfollowingUser(@Param() params, @Request() req) {
    const user = await this.userService.getUserById(req.user._id);
    if (!(await this.userService.checkFollowUser(user, params.userId)))
      return { follow: 'false' };
    else return { follow: 'true' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me/follower')
  async getFollowers(
    @Request() req,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowers(req.user._id, limit, offset);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me/following')
  async getFollowings(
    @Request() req,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowings(req.user._id, limit, offset);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId/follower')
  async getUserFollowers(
    @Request() req,
    @Param() params,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowers(params.userId, limit, offset);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId/following')
  async getUserFollowings(
    @Request() req,
    @Param() params,
    @Query('limit') limit: Number,
    @Query('offset') offset: Number,
  ) {
    return await this.userService.userFollowings(params.userId, limit, offset);
  }

  @Get('/Home/:index')
  async getPublicHome(@Param('index') index: number) {
    let pins = await this.userService.getPublicHome(index);
    return pins;
  }
}
