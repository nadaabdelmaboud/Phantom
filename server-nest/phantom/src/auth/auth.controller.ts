import {
  Body,
  UseGuards,
  Controller,
  Post,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Email } from '../shared/send-email.service'
@Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private Email: Email,
  ) { }

  @Post('/login')
  async login(@Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    if (!user) throw new Error('topic not found');
    const payload: Payload = {
      _id: user._id,
    };
    const token = await this.authService.signPayload(payload);
    return { profileImage: user.profileImage, token };
  }

  @Post('/sign_up')
  async sign_up(@Body() userDTO: RegisterDTO) {
    const user = await this.userService.checkCreateData(userDTO);
    const token = await this.authService.signPayload(userDTO);
    await this.Email.sendEmail(userDTO.email, token, 'confirm', userDTO.firstName)
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/sign_up/confirm')
  async confirm(@Request() req) {
    console.log(req.user)
    const user = await this.userService.createUser(req.user);
    const payload: Payload = {
      _id: user._id,
    };
    const token = await this.authService.signPayload(payload);
    return { profileImage: user.profileImage, token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async me(@Request() req) {
    /* const { password, ...result } = req.user._doc;*/
    const user = await this.userService.getUserById(req.user._id);
    console.log(user);
    user.password = undefined;
    return { user };
  }
}
