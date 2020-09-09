import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';

import { UserService } from './user.service';
import { Payload } from '../types/payload';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}
  async googleLogin(req) {
    if (!req.user) {
      throw new NotFoundException('no such user on google');
    }
    let user = req.user;
    let checkUser = await this.userService.checkMAilExistAndFormat(user.email);
    let payload;
    if (!checkUser) {
      let newUser = await this.userService.createUser({
        email: user.email,
        birthday: null,
        firstName: user.firstName,
        lastName: user.lastName,
        password: '',
        isGoogle: true,
      });
      if (!newUser) {
        throw new BadRequestException();
      }
      payload = {
        _id: newUser._id,
      };
    } else {
      payload = {
        _id: checkUser._id,
      };
    }
    return (
      'Bearer ' +
      sign(payload, process.env.SECRET_KEY, { expiresIn: '67472347632732h' })
    );
  }
  async signPayload(payload) {
    return (
      'Bearer ' +
      sign(payload, process.env.SECRET_KEY, { expiresIn: '67472347632732h' })
    );
  }
  async validateUser(payload: Payload) {
    const user = await this.userService.getUserById(payload._id);
    return user;
  }
}
