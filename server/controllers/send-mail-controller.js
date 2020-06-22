var nodemailer = require('nodemailer');
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

    
    return 1;
};