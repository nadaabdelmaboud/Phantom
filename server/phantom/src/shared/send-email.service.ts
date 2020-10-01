import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
/**
 * @module Email
 */
@Injectable()
export class Email {
  constructor() {}

  /**
   * @author Aya Abohadima
   * @descriptionsend email to user email
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
        subject: '👋 Confirm Email',
        html:
          '<html><h1>  Hi,' +
          userName +
          ' 😊 </h1> <p> You Should Confirm Your Email to Complete SignUp </p> <h2> <a href="' +
          String(process.env.FRONT_BASE_URL) +
          '/confirm?token=' +
          message +
          '&type=signup" target ="_blank">Confirm</a></h2></html>',
      };
    } else if (type === 'change email') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '👋 Email Update',
        html:
          '<html><h1>  Hi,' +
          userName +
          ' 😊 </h1> <p> The Email Address On Your Phantom Account Has Been Changed.<br> To Confirm Changing Your Email Please Follow This Link </p> <h2> <a href="' +
          String(process.env.FRONT_BASE_URL) +
          '/changeEmail?token=' +
          message +
          '&type=changeEmail" target ="_blank">Confirm</a></h2></html>',
      };
    } else if (type === 'set email') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '👋 Email Reset',
        html:
          '<html><h1>  Hi,' +
          userName +
          ' 😊 </h1> Follow This Link To Confirm Your New Email On Phantom</h2><h2><a href="' +
          String(process.env.FRONT_BASE_URL) +
          '/changeEmail?token=' +
          message +
          '&type=resetEmail" target ="_blank">Confirm</a></h2></html>',
      };
    } else if (type === 'forget Password') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '👋 Reset Password ',
        html:
          '<html><h1>   Hi,' +
          userName +
          ', 😊 </h1> Follow This Link To Reset Your Password </p> <h2> <a href="' +
          String(process.env.FRONT_BASE_URL) +
          '/reset_password?token=' +
          message +
          '" target ="_blank">Reset Password</a></h2></html>',
      };
    } else if (type === 'Delete account') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: '😔 Delete Account ',
        html:
          '<html><h1>  Hi,' +
          userName +
          '  </h1> <p> Phantom Will Miss You </p>  <p>Follow This Link To Get Back To Phantom <p></p> <h2> <a href="' +
          String(process.env.FRONT_BASE_URL) +
          '" target ="_blank">Phantom</a></h2></html>',
      };
    } else if (type === 'report') {
      mailOptions = {
        from: '"Phantom" <' + String(process.env.EMAIL) + '>',
        to: email,
        subject: 'Pin Is Reported',
        html:
          '<html><p> ' +
          message.userName +
          ' (userEmail: ' +
          message.email +
          ' (userId: ' +
          message.userId +
          ' ) has reported a pin for ' +
          message.reason +
          ' </p> <h2> <a href="' +
          String(process.env.FRONT_BASE_URL) +
          '/PostPage/' +
          message.pinId +
          '"target ="_blank">Pin Page</a></h2></html>',
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
