import {
  Controller,
  Get,
  Body,
  Post,
  Request,
  Delete,
  HttpStatus,
  HttpException,
  Query,
  UseGuards,
  Req,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { Payload } from '../types/payload';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Email } from '../shared/send-email.service';
@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private email: Email,
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const data = await this.authService.googleLogin(req);
    if (data) {
      console.log( process.env.FRONT_BASE_URL +
        '/aouth/google?token=' +
        data.token +
        '&type=' +
        data.type)
      res.redirect(
        process.env.FRONT_BASE_URL +
          '/aouth/google?token=' +
          data.token +
          '&type=' +
          data.type,
      );
    } else {
      throw new NotFoundException();
    }
  }
  @Post('/login')
  async login(@Body() userDTO: LoginDto) {
    const user = await this.userService.findByLogin(userDTO);
    if (!user) throw new Error('topic not found');
    const payload: Payload = {
      _id: user._id,
    };
    const token = await this.authService.signPayload(payload);
    return { profileImage: user.profileImage, token };
  }

  @Post('/sign_up')
  async sign_up(@Body() userDTO: RegisterDto) {
    const user = await this.userService.checkCreateData(userDTO);
    const token = await this.authService.signPayload(userDTO);
    await this.email.sendEmail(
      userDTO.email,
      token,
      'confirm',
      userDTO.firstName,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/sign_up/confirm')
  async confirm(@Request() req) {
    const user = await this.userService.createUser(req.user);
    const payload: Payload = {
      _id: user._id,
    };
    const token = await this.authService.signPayload(payload);
    return { profileImage: user.profileImage, token };
  }

  @Get('/checkEmail')
  async checkEmail(@Query('email') email: string) {
    const user = await this.userService.checkMAilExistAndFormat(email);
    if (user)
      throw new HttpException('this user is exists', HttpStatus.FORBIDDEN);
  }
  @Post('/forget-password')
  async forgetPassword(@Body() body) {
    const user = await this.userService.checkMAilExistAndFormat(body.email);
    if (!user)
      throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
    const payload: Payload = {
      _id: user._id,
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    await this.email.sendEmail(
      user.email,
      token,
      'forget Password',
      user.firstName,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/me/delete')
  async deleteMe(@Request() req) {
    const user = await this.userService.getUserById(req.user._id);
    await this.userService.deleteUser(req.user._id);
    await this.email.sendEmail(
      user.email,
      null,
      'Delete account',
      user.firstName,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async me(@Request() req) {
    const user = await this.userService.getUserById(req.user._id);
    user.password = null;
    return { user };
  }
}
