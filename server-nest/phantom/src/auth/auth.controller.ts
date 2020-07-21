import * as nestCommon from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../shared/user.service';
import { Payload } from '../types/payload';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Email } from '../shared/send-email.service'
@nestCommon.Controller()
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private Email: Email,
  ) { }

  @nestCommon.Post('/login')
  async login(@nestCommon.Body() userDTO: LoginDTO) {
    const user = await this.userService.findByLogin(userDTO);
    if (!user) throw new Error('topic not found');
    const payload: Payload = {
      _id: user._id,
    };
    const token = await this.authService.signPayload(payload);
    return { profileImage: user.profileImage, token };
  }

  @nestCommon.Post('/sign_up')
  async sign_up(@nestCommon.Body() userDTO: RegisterDTO) {
    const user = await this.userService.checkCreateData(userDTO);
    const token = await this.authService.signPayload(userDTO);
    await this.Email.sendEmail(userDTO.email, token, 'confirm', userDTO.firstName)
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Post('/sign_up/confirm')
  async confirm(@nestCommon.Request() req) {
    console.log(req.user)
    const user = await this.userService.createUser(req.user);
    const payload: Payload = {
      _id: user._id,
    };
    const token = await this.authService.signPayload(payload);
    return { profileImage: user.profileImage, token };
  }

  @nestCommon.Get('/checkEmail')
  async checkEmail(@nestCommon.Query('email') email: string) {
    const user = await this.userService.checkMAilExistAndFormat(email);
    if (user) throw new nestCommon.HttpException('this user is exists', nestCommon.HttpStatus.FORBIDDEN);
  }
  @nestCommon.Post('/forget-password')
  async forgetPassword(@nestCommon.Body() body) {
    const user = await this.userService.checkMAilExistAndFormat(body.email);
    if (!user) throw new nestCommon.HttpException('not user by this email', nestCommon.HttpStatus.FORBIDDEN);
    const payload: Payload = {
      _id: user._id,
      email: user.email
    };
    const token = await this.authService.signPayload(payload);
    await this.Email.sendEmail(payload.email, token, 'forget Password', user.firstName);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Delete('/me/delete')
  async deleteMe(@nestCommon.Request() req) {
    const user = await this.userService.getUserById(req.user._id);
    await this.userService.deleteUser(req.user._id);
    await this.Email.sendEmail(user.email, undefined, 'Delete account', user.firstName);
  }

  @nestCommon.UseGuards(AuthGuard('jwt'))
  @nestCommon.Get('/me')
  async me(@nestCommon.Request() req) {
    /* const { password, ...result } = req.user._doc;*/
    const user = await this.userService.getUserById(req.user._id);
    user.password = undefined;
    return { user };
  }
}
