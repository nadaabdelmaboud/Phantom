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
    if (await this.checkMAilExistAndFormat(RegisterDTO.email))
      throw new HttpException('"email" should not have acount', HttpStatus.FORBIDDEN,);
  }

  async createUser(RegisterDTO: RegisterDTO): Promise<any> {
    await this.checkCreateData(RegisterDTO);
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
    const body = { email: email };
    const shcema = Joi.object({ email: Joi.string().trim().email().required() });
    const validate = shcema.validate(body);
    if (validate.error != null) throw new HttpException(validate.error, HttpStatus.FORBIDDEN);
    const user = await this.userModel.findOne({ email: email });
    return user;
  }


  async resetPassword(userId, newPassword) {
    //if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
    const user = await this.getUserById(userId);
    if (!user || !newPassword) throw new HttpException('there is no new password', HttpStatus.FORBIDDEN);
    const salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(newPassword, salt);
    user.password = hash;
    await this.userModel.updateOne({ _id: userId }, { password: hash });
    return 1;
  }

  /**
   * update information in user profile 
   * @param {String} userId -id of user
   * @param {ٍString} firstName -new first name for user 
   * @param {String} lastName -new last name for user 
   * @param {String} about -new info about user 
   * @param {String} gender -new gender for user 
   * @param {String} country -new country for user
   * @param {String} email  -new email for user
   * @param {String} birthDate -new birthDate of user
   * @returns {Number}
  */
  /*
   async updateUserInfo(userId, firstName, lastName, about, gender, country, email, birthDate) {
     //try {
      // if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
       const user = await this.getUserById(userId);
       if (!user) return 0;
       if (firstName) await this.userModel.updateOne({ _id: userId }, { firstName: firstName });
       if (lastName) await this.userModel.updateOne({ _id: userId }, { lastName: lastName });
       if (about) await this.userModel.updateOne({ _id: userId }, { about: about });
       if (gender) await this.userModel.updateOne({ _id: userId }, { gender: gender });
       if (country) await this.userModel.updateOne({ _id: userId }, { country: country });
       if (email && ! await this.checkMAilExistAndFormat(email)) {
         var token = jwt.sign({
           email: user.email,
           _id: user._id,
           newEmail: email,
           firstName: firstName ? firstName : user.firstName
         }, process.env.jwtsecret, { expiresIn: '904380934853454h' });
         sendmail(user.email, token, 'change email', firstName ? firstName : user.firstName);
       }
       if (birthDate) await userDocument.updateOne({ _id: userId }, { birthDate: birthDate });
       return 1;
   //  } catch (err) { return 0; }
   }
   
   /**
    * set user email
    * @param {string} userId - id of user
    * @param {string} newEmail  - new email 
    * @returns {Number}
    
   setEmail: async function(userId, newEmail) {
     try {
       if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
       const user = await this.getUserById(userId);
       if (!user || !newEmail) return 0;
       await userDocument.updateOne({ _id: userId }, { email: newEmail });
       return 1;
     } catch (err) { return 0; }
   }
 */
  async deleteUser(id) {
    const user = await this.getUserById(id);
    return await this.userModel.findByIdAndDelete(id);
  }
}
