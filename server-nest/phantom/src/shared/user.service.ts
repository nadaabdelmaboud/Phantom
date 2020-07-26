import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { sign } from 'jsonwebtoken';
import { user } from '../types/user';
import { Email } from '../shared/send-email.service';
import { LoginDto } from '../auth/dto/login.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UpdateDto } from '../user/dto/update-user.dto';
import { Payload } from '../types/payload';
import * as Joi from '@hapi/joi';
import * as bcrypt from 'bcrypt';
import { ValidationService } from './validation.service';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<user>,
    private email: Email,
    private ValidationService: ValidationService,
  ) { }
  async getUserById(id) {
    const user = await this.userModel.findById(id);
    if (!user)
      new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
    return user;
  }

  async findByLogin(loginDto: LoginDto): Promise<any> {
    console.log(loginDto.password);
    const user = await this.userModel
      .findOne({ email: loginDto.email })
      .exec()
      .then(async user => {
        return user ? user : 0;
      });
    if (!user)
      throw new HttpException('not user by this email', HttpStatus.FORBIDDEN);
    if (await bcrypt.compare(loginDto.password, user.password)) return user;
    throw new HttpException('password is not correct', HttpStatus.FORBIDDEN);
  }
  async checkCreateData(registerDto: RegisterDto) {
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
    const body = registerDto;
    const validate = shcema.validate(body);
    if (validate.error)
      throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
    if (await this.checkMAilExistAndFormat(registerDto.email))
      throw new HttpException(
        '"email" should not have acount',
        HttpStatus.FORBIDDEN,
      );
  }

  async checkUpdateData(updateDto: UpdateDto) {
    const shcema = Joi.object({
      email: Joi.string()
        .trim()
        .email()
        .optional(),
      password: Joi.string().optional(),
      birthDate: Joi.date()
        .raw()
        .optional(),
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      country: Joi.string().optional(),
      gender: Joi.string().optional(),
      bio: Joi.string().optional(),
      iat: Joi.optional(),
      exp: Joi.optional(),
      profileImage: Joi.string().optional(),
    });
    const body = updateDto;
    const validate = shcema.validate(body);
    if (validate.error)
      throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
    if (updateDto.email)
      if (await this.checkMAilExistAndFormat(updateDto.email))
        throw new HttpException(
          '"email" should not have acount',
          HttpStatus.FORBIDDEN,
        );
  }

  async createUser(registerDto: RegisterDto): Promise<any> {
    await this.checkCreateData(registerDto);
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(registerDto.password, salt);
    var newUser = new this.userModel({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      password: hash,
      about: registerDto.bio,
      gender: registerDto.gender,
      country: registerDto.country,
      birthDate: registerDto.birthday,
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
    const body = { email: email };
    const shcema = Joi.object({
      email: Joi.string()
        .trim()
        .email()
        .required(),
    });
    const validate = shcema.validate(body);
    if (validate.error != null)
      throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
    const user = await this.userModel.findOne({ email: email });
    return user;
  }

  async resetPassword(userId, newPassword) {
    //if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
    const user = await this.getUserById(userId);
    if (!user || !newPassword)
      throw new HttpException('there is no new password', HttpStatus.FORBIDDEN);
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await this.userModel.updateOne({ _id: userId }, { password: hash });
    return 1;
  }

  /**
   * update information in user profile
   * @param {String} userId -id of user
   */

  async updateUserInfo(userId, updateDto: UpdateDto) {
    // if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
    const user = await this.getUserById(userId);
    if (!user) return 0;
    if (updateDto.firstName)
      await this.userModel.updateOne(
        { _id: userId },
        { firstName: updateDto.firstName },
      );
    if (updateDto.lastName)
      await this.userModel.updateOne(
        { _id: userId },
        { lastName: updateDto.lastName },
      );
    if (updateDto.bio)
      await this.userModel.updateOne({ _id: userId }, { about: updateDto.bio });
    if (updateDto.gender)
      await this.userModel.updateOne(
        { _id: userId },
        { gender: updateDto.gender },
      );
    if (updateDto.country)
      await this.userModel.updateOne(
        { _id: userId },
        { country: updateDto.country },
      );
    if (updateDto.profileImage) {
      let profileImage = mongoose.Types.ObjectId(updateDto.profileImage);
      await this.userModel.updateOne(
        { _id: userId },
        { profileImage: profileImage },
      );
    }

    if (
      updateDto.email &&
      !(await this.checkMAilExistAndFormat(updateDto.email))
    ) {
      var token =
        'Bearer ' +
        sign(
          {
            email: user.email,
            _id: user._id,
            newEmail: updateDto.email,
            firstName: updateDto.firstName
              ? updateDto.firstName
              : user.firstName,
          },
          process.env.SECRET_KEY,
          { expiresIn: '67472347632732h' },
        );

      await this.email.sendEmail(
        user.email,
        token,
        'change email',
        updateDto.firstName ? updateDto.firstName : user.firstName,
      );
    }
    if (updateDto.birthDate)
      await this.userModel.updateOne(
        { _id: userId },
        { birthDate: updateDto.birthDate },
      );
    return 1;
  }

  /**
   * set user email
   * @param {string} userId - id of user
   * @param {string} newEmail  - new email
   * @returns {Number}
   */
  async setEmail(userId, newEmail) {
    // if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
    const user = await this.getUserById(userId);
    if (!user || !newEmail) return 0;
    await this.userModel.updateOne({ _id: userId }, { email: newEmail });
    return 1;
  }

  async deleteUser(id) {
    const user = await this.getUserById(id);
    return await this.userModel.findByIdAndDelete(id);
  }
  async setViewState(userId, viewState) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('user not found');
    if (viewState != 'Default' && viewState != 'Compact') {
      throw new BadRequestException(
        "view state must be 'Default' or 'Compact' only",
      );
    }
    user.viewState = viewState;
    await user.save();
    return viewState;
  }
  async getViewState(userId) {
    if ((await this.ValidationService.checkMongooseID([userId])) == 0) {
      throw new BadRequestException('not valid id');
    }
    const user = await this.getUserById(userId);
    if (!user) throw new NotFoundException('user not found');

    if (user.viewState) return user.viewState;
    return false;
  }
}
