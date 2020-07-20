import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { user } from '../types/user';
import { LoginDTO } from '../auth/dto/login.dto';
import { RegisterDTO } from '../auth/dto/register.dto';
import { Payload } from '../types/payload';
import * as Joi from '@hapi/joi';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<user>) { }
  async getUserById(id) {
    const user = await this.userModel.findById(id);
    if (!user)
      new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    return user;
  }

  async findByLogin(LoginDTO: LoginDTO): Promise<any> {
    console.log(LoginDTO.password);
    const user = await this.userModel
      .findOne({ email: LoginDTO.email })
      .exec()
      .then(async user => {
        return user ? user : 0;
      });
    if (!user)
      throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
    if (await bcrypt.compare(LoginDTO.password, user.password)) return user;
    throw new HttpException('password is not correct', HttpStatus.FORBIDDEN);
  }
  async checkCreateData(RegisterDTO: RegisterDTO) {
    const shcema = Joi.object({
      email: Joi.string()
        .trim()
        .email()
        .required(),
      password: Joi.string().required(),
      birthday: Joi.date()
        .raw()
        .required(),
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      country: Joi.string().optional(),
      gender: Joi.string().optional(),
      bio: Joi.string().optional(),
      iat: Joi.optional(),
      exp: Joi.optional(),
    });
    const body = RegisterDTO;
    const validate = shcema.validate(body);
    if (validate.error)
      throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
  }

  async createUser(RegisterDTO: RegisterDTO): Promise<any> {
    await this.checkCreateData(RegisterDTO);
    if (await this.checkMAilExistAndFormat(RegisterDTO.email))
      throw new HttpException(
        '"email" should not have acount',
        HttpStatus.FORBIDDEN,
      );
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(RegisterDTO.password, salt);
    var newUser = new this.userModel({
      firstName: RegisterDTO.firstName,
      lastName: RegisterDTO.lastName,
      email: RegisterDTO.email,
      password: hash,
      about: RegisterDTO.bio,
      gender: RegisterDTO.gender,
      country: RegisterDTO.country,
      birthDate: RegisterDTO.birthday,
      pins: [],
      uploadedImages: [],
      savedImages: [],
      notifications: [],
      offlineNotifications: [],
      followers: [],
      following: [],
      boards: [],
      counts: {
        likes: 0,
        comments: 0,
        repins: 0,
        saves: 0,
      },
      createdAt: Date.now(),
    });
    await newUser.save();
    await this.userModel.updateOne(
      { _id: newUser._id },
      { profileImage: newUser._id },
    );
    newUser = await this.getUserById(newUser._id);
    return newUser;
  }

  async checkMAilExistAndFormat(email) {
    try {
      const body = { email: email };
      const shcema = Joi.object({
        email: Joi.string()
          .trim()
          .email()
          .required(),
      });
      const validate = shcema.validate(body);
      if (validate.error != null) return -1;
      const user = await this.userModel.findOne({ email: email });
      console.log(user);
      return user;
    } catch (ex) {
      return 0;
    }
  }
}
