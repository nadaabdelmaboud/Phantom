import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class Email {
  constructor() { }

  /**
   * send email to user email
   * @param {String} email - email should send to 
   * @param {String} message - message which should send  
   * @param {String} type - why send this email confirm ,change email ,.... 
   * @param {String} userName  - the name of email owner 
   */
  async sendEmail(email, message, type, userName) {
    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.EMAIL_PASSWORD),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    var mailOptions;
    if (type === 'confirm') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '👋 Please confirm your email',
        html:
          '<html><h1>  Hi,' +
          userName +
          ' 😊 </h1> <p> you should confirm your email to complete sign up </p> <h2> <a href="' + String(process.env.FRONT_BASE_URL) + '/confirm?token=' +
          message +
          '&type=signup" target ="_blank">Confirm</a></h2></html>',
      };
    } else if (type === 'change email') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: 'You changed your email address on Phantom',
        html:
          '<html><h1>  Hi,' +
          userName +
          ' 😊 </h1> <p> The email address on your Phantom account was just changed. Did you make this change?<br> if you need it change follow this like </p> <h2> <a href="' + String(process.env.FRONT_BASE_URL) + '/changeEmail?token=' +
          message +
          '&type=changeEmail" target ="_blank">sure change email</a></h2></html>',
      };
    } else if (type === 'set email') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '👋 You reset your email address on Phantom',
        html:
          '<html><h1>  Hi,' +
          userName +
          ' 😊 </h1> you reset this email to be your new email <br> please follow this link to confirm that </h2><h2><a href="' + String(process.env.FRONT_BASE_URL) + '/changeEmail?token=' +
          message +
          '&type=resetEmail" target ="_blank">sure email</a></h2></html>',
      };
    } else if (type === 'forget Password') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '👋 Please reset your password ',
        html:
          '<html><h1>   Hi,' +
          userName +
          ', 😊 </h1> <p> please, do not worry at all  </p> <p> follow this link to reset your password  </p> <h2> <a href="' + String(process.env.FRONT_BASE_URL) + '/reset_password?token=' +
          message +
          '" target ="_blank">Reset Password</a></h2></html>',
      };
    } else if (type === 'Delete account') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '😔 Sure delete account ',
        html:
          '<html><h1>  Hi,' +
          userName +
          '  </h1> <p>Really, We are very sad because you will leave us </p> <p>We have been very happy with you </p> <p>follow this link  and return to us  <p></p> <h2> <a href="' + String(process.env.FRONT_BASE_URL) + '" target ="_blank">phantom</a></h2></html>',
      };
    } else if (type === 'report') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: 'Pin Is Reported',
        html:
          '<html><p> ' +
          message.userName +
          ' (userId: ' +
          message.userId +
          ' ) has reported a pin for ' +
          message.reason +
          ' </p> <h2> <a href="' + String(process.env.FRONT_BASE_URL) + '/PostPage/' +
          message.pinId +
          "' target ='_blank'>Pin Page</a></h2></html>",
      };
    } else {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: 'Phantom has a message for you',
        text: message,
      };
    }
    transporter.sendMail(mailOptions);
    return 1;
  }
}
