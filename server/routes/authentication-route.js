const router = require('express').Router();
const auth =require('../middlewares/auth-middleware');
const User = require('../controllers/user-controller');
const Joi = require('joi');
var sendmail = require('../controllers/send-mail-controller');
const jwt = require('jsonwebtoken');

// route for user sign up
router.post('/sign_up', async(req, res) => {
    
    try{
    // set Joi validation schema to check correctness of data
    const shcema = Joi.object().keys({
        email: Joi.string().trim().email().required(),
        password: Joi.string().required(),
        country: Joi.string().required(),
        birthday: Joi.date().raw().required(),
        firstName: Joi.string().required(),
        lastName :Joi.string().required(),
        bio : Joi.string().optional()
    });
  
    Joi.validate(req.body, shcema, async(err, result) => {
        if (err) {
            // if not valid set status to 500
            res.status(500).json({
                error: err
            })

        } else {
            // if valid check that email didnt exist before
            if(await User.checkMAilExistAndFormat( req.body.email)){
                return res.status(403).json({
                    message: 'Mail exists'
                });  
            }
            var token = jwt.sign({email: req.body.email,password:req.body.birthday ,firstName:req.body.fristName ,lastName:req.body.lastName ,country:req.body.country ,birthday:req.body.birthday ,bio:req.body.bio }, process.env.jwtsecret, {
                expiresIn: '904380934853454h'
            });
           
            if(await sendmail( req.body.email, String(token), 'confirm')) 
               return  res.status(204).json({ success: 'sign up done ' })
            else return res.status(400);
           
        }
    });
}catch(ex){
    res.status(400).send({ 'error': 'error in making the request' });
}
});
module.exports = router;