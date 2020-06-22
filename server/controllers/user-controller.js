const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument, user } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const Joi = require('joi');
const bcrypt = require('bcrypt');

const User = {

    getUserById: async function (userId) {
        try {
            if (!checkMonooseObjectID([userId])) throw new Error('not mongoose id');
            const user = await userDocument.findById(userId, (err, user) => {
                if (err) return 0;
                return user;
            }).catch((err) => 0);

            return user;
        } catch (ex) {
            return 0;
        }
    },
    checkMAilExistAndFormat: async function (email) {
        try {
            const body = { email: email };
            const shcema = Joi.object().keys({
                email: Joi.string().trim().email().required(),
            });
            const validate = Joi.validate(body, shcema, async (err, result) => {
                if (err) return 0;
                return 1;
            })
            if (!validate) return -1;

            user = await userDocument.findOne({ email: email }).exec().then(async user => {
                return user ? user : 0;
            });
            return user;
        } catch (ex) {
            return 0;
        }
    },

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
            const validate = Joi.validate(user, shcema, async (err, result) => {
                if (err) return 0;
                else return 1;
            })
            if (!validate) return 0;
            const newUser = new userDocument({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
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
            const salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(user.password, salt);
            newUser.password = hash;
            await newUser.save();
            return newUser;
        } catch (ex) {
            return 0;
        }
    },

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
        } catch (ex) {
            return 0;
        }
    },
    getUserProfile: async function (userId) {
        try {
            const user = await this.getUserById(userId);
            if (!user) return 0;
            return {
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
        } catch (err) {
            return 0;
        }
    },

}

module.exports = User;