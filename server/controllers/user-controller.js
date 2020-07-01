const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument, user } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const Joi = require('joi');
const bcrypt = require('bcrypt');
var sendmail = require('../controllers/send-mail-controller');
const jwt = require('jsonwebtoken');
const User = {

    /**
     * get user by id 
     * @param {String} userId  - the user id 
     * @returns {object} -if there is user has this id 
     */
    getUserById: async function (userId) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            const user = await userDocument.findById(userId);
            return user;
        } catch (ex) { return 0; }
    },

    /**
     * check if email is in email format and if it is exists 
     * @param {String} email  -the email went check
     * @returns {object | Number}  
     */
    checkMAilExistAndFormat: async function (email) {
        try {
            const body = { email: email };
            const shcema = Joi.object().keys({ email: Joi.string().trim().email().required() });
            const validate = Joi.validate(body, shcema);
            if (validate.error != null) return -1;
            const user = await userDocument.findOne({ email: email });
            //consolconsole.log(user);
            return user;
        } catch (ex) { return 0; }
    },

    /**
     *create a new user  
     * @param {object} user - object has email, password, brithday, fristName, lastName and bio as optional. 
     * @returns {object} created user object 
     */
    createUser: async function (user) {
        try {
            const shcema = Joi.object().keys({
                email: Joi.string().trim().email().required(),
                password: Joi.string().required(),
                birthday: Joi.date().raw().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                bio: Joi.string().optional(),
                iat: Joi.required(),
                exp: Joi.required()
            });
            const validate = Joi.validate(user, shcema);
            if (validate.error != null) return 0;
            if (await this.checkMAilExistAndFormat(user.email)) return -1;
            const salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(user.password, salt);
            const newUser = new userDocument({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: hash,
                about: user.bio,
                birthDate: user.birthday,
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
                    saves: 0
                },
                createdAt: Date.now(),
            })
            await newUser.save();
            return newUser;
        } catch (ex) { return 0; }
    },

    /**
     * check user with email has this password used for login 
     * @param {String} email - user email
     * @param {String} password  - user password
     * @returns {object | Number}
     */
    checkEmailAndPass: async function (email, password) {
        try {
            const user = await userDocument.findOne({ email: email }).exec().then(async user => {
                return user ? user : 0;
            });;
            if (!user) return 0;
            return bcrypt.compare(password, user.password).then(isMatch => {
                if (isMatch) return user;
                return -1;
            })
        } catch (ex) { return 0; }
    },

    /**
     * get user profile 
     * @param {String} userId - user id
     * @returns {object | Number} 
     */
    getUserProfile: async function (userId) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            const user = await this.getUserById(userId);
            if (!user) return 0;
            return {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                country: user.country,
                birthDate: user.birthDate,
                bio: user.about,
                gender: user.gender,
                profileImage: user.profileImage,
                pins: user.pins,
                uploadedImages: user.uploadedImages,
                savedImages: user.savedImages,
                followers: user.followers,
                following: user.following,
                boards: user.boards,
                counts: user.counts,
                createdAt: user.createdAt,
            }
        } catch (err) { return 0; }
    },

    /**
     * delete user account 
     * @param {String} userId - user id 
     * @returns {Number} 
     */
    deleteUser: async function (userId) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            return await userDocument.findByIdAndDelete(userId)
        } catch (err) { return 0; }
    },
    /**
     *  reset new password 
     * @param {String} -userId user id 
     * @param {String} -newPassword -the new user password  
     * @returns {Number} 1 if sucess and 0 if faild
     */
    resetPassword: async function (userId, newPassword) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            const user = await this.getUserById(userId);
            if (!user || !newPassword) return 0;
            const salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(newPassword, salt);
            user.password = hash;
            await userDocument.updateOne({ _id: userId }, { password: hash });
            return 1;
        } catch (err) { return 0; }
    },

    updateUserInfo: async function (userId, firstName, lastName, about, gender, country, email, birthDate) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            const user = await this.getUserById(userId);
            if (!user) return 0;
            if (firstName) await userDocument.updateOne({ _id: userId }, { firstName: firstName });
            if (lastName) await userDocument.updateOne({ _id: userId }, { lastName: lastName });
            if (about) await userDocument.updateOne({ _id: userId }, { about: about });
            if (gender) await userDocument.updateOne({ _id: userId }, { gender: gender });
            if (country) await userDocument.updateOne({ _id: userId }, { country: country });
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
        } catch (err) { return 0; }
    },
    setEmail: async function (userId, newEmail) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            const user = await this.getUserById(userId);
            if (!user || !newEmail) return 0;
            await userDocument.updateOne({ _id: userId }, { email: newEmail });
            return 1;
        } catch (err) { return 0; }
    },
    checkFollowUser: async function (user, userId) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            if (!user.following) await userDocument.updateOne({ _id: user._id }, { following: [] });
            for (let i = 0; i < user.following.length; i++)
                if (String(userId) == String(user.following[i]))
                    return true;
            return false;
        } catch (err) { return 0; }
    },

    followUser: async function (userId1, userId2) {
        try {
            if (!checkMonooseObjectID([userId1, userId2])) throw new Error('not mongoose id');
            userFollow = await User.getUserById(userId1);
            followedUser = await User.getUserById(userId2);
            if (!userFollow || !followedUser) return 0;
            if (await this.checkFollowUser(userFollow, userId2)) return -1;
            userFollow.following.push(userId2);
            await userDocument.updateOne({ _id: userFollow._id }, { following: userFollow.following });
            if (!followedUser.followers) followedUser.followers = [];
            followedUser.followers.push(userId1);
            await userDocument.updateOne({ _id: followedUser._id }, { followers: followedUser.followers });
            return 1;
        } catch (err) { return 0; }
    },
    unfollowUser: async function (userId1, userId2) {
        try {
            if (!checkMonooseObjectID([userId1, userId2])) throw new Error('not mongoose id');
            userFollow = await User.getUserById(userId1);
            followedUser = await User.getUserById(userId2);
            if (!userFollow || !followedUser) return 0;
            if (!await this.checkFollowUser(userFollow, userId2)) return -1;
            if (userFollow.following) {
                for (let i = 0; i < userFollow.following.length; i++) {
                    if (String(userFollow.following[i]) == String(userId2)) {
                        userFollow.following.splice(i, 1);
                        await userDocument.updateOne({ _id: userFollow._id }, { following: userFollow.following });
                        break;
                    }
                }
            } else return 0;
            if (followedUser.followers) {
                for (let i = 0; i < followedUser.followers.length; i++) {
                    if (String(followedUser.followers[i]) == String(userId1)) {
                        followedUser.followers.splice(i, 1);
                        await userDocument.updateOne({ _id: followedUser._id }, { followers: followedUser.followers });
                        return 1;
                    }
                }
            } else return 0;
        } catch (err) { return 0; }
    },
}

module.exports = User;