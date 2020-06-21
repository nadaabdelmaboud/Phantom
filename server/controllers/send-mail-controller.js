var nodemailer = require('nodemailer');
const emailExistance = require('email-existence');
module.exports = async function(email, message, type) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: String(process.env.EMAIL),
            pass: String(process.env.EMAIL_PASSWORD)
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    var mailOptions;
    const ifEmail= emailExistance.check(email, function(err, res) {
       return res;
    })
    if(!ifEmail||ifEmail=="false") return 0;

     if (type == "confirm") {
        mailOptions = {
            from: '"Phantom Contact" <' + String(process.env.EMAIL) + '>',
            to: email,
            subject: 'Phantom SAMA has A Message FOR YOU ^^',
            text: 'Please follow this URL to confirm your account http://100.25.194.8/confirm?token=' + message+'&type=signup'
            // should be fornt link 

        };
    }
     else {
        mailOptions = {
            from: '"Spotify Contact" <' + String(process.env.EMAIL) + '>',
            to: email,
            subject: 'MARIOPLEX SAMA has A Message FOR YOU ^^',
            text: message
        };
    }

    transporter.sendMail(mailOptions, function(error, info) {
        if (error)
            if (email == String(process.env.EMAIL)) {
                // at frist send email to myself if not send correctly change the env variables
                console.log('your email is not correct which enter in env variables');
            }
    });
    return 1;
};