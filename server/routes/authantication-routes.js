const router = require('express').Router();
const auth=require('../middlewares/auth-middleware');
const User = require('../controllers/user-controller');
const Joi = require('joi');
const jwtSeret = require('../config/jwt-config');
var sendmail = require('../controllers/send-mail-controller');
const jwt = require('jsonwebtoken');

