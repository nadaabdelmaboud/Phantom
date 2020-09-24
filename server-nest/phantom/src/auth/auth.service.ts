import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { Payload } from '../types/payload';

@Injectable()
export class AuthService {

  constructor(private userService: UserService) { }
  /**
   * @author Nada Abdelmaboud
   * @description login with gmail
   * @param {Object} req - 
   */
  async googleLogin(req) {
    if (!req.user) {
      throw new NotFoundException('no such user on google');
    }
    let user = req.user;
    let type;
    let checkUser = await this.userService.checkMAilExistAndFormat(user.email);
    let payload;
    if (!checkUser) {
      type = 'sign';
      let newUser = await this.userService.createUser({
        email: user.email,
        birthday: null,
        firstName: user.firstName,
        lastName: user.lastName,
        password: '',
        isGoogle: true,
        profileImage: user.picture,
      });
      if (!newUser) {
        throw new BadRequestException();
      }
      payload = {
        _id: newUser._id,
      };
    } else {
      type = 'login';
      payload = {
        _id: checkUser._id,
      };
    }
    return {
      token:
        'Bearer ' +
        sign(payload, process.env.SECRET_KEY, { expiresIn: '67472347632732h' }),
      type: type,
    };
  }

  /**
   * @author Aya Abohadima
   * @description sign payload function : create token 
   * @param payload - object went to convert to token 
   * @returns token which created  
   */
  async signPayload(payload) {
    return (
      'Bearer ' +
      sign(payload, process.env.SECRET_KEY, { expiresIn: '67472347632732h' })
    );
  }

  /**
   * validateUser : check if this object which come from token is user or not .
   * @param payload - object which come from token .
   * @returns user object 
   */
  async validateUser(payload: Payload) {
    const user = await this.userService.getUserById(payload._id);
    return user;
  }
}
