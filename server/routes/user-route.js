const router = require('express').Router();
const auth = require('../middlewares/auth-middleware');
const User = require('../controllers/user-controller');
var sendmail = require('../controllers/send-mail-controller');
const Joi = require('joi');
//const { user } = require('../models/db');


router.get('/me', auth, async (req, res) => {
    const user = await User.getUserProfile(req.user._id);
    if (!user) return res.status(403).json({ error: 'no user !' });
    return res.json(user);
});

router.get('/user/:user_id', async (req, res) => {

    const user = await User.getUserProfile(req.params.user_id);
    if (!user) return res.status(403).json({ error: 'no user !' });
    return res.json(user);
});

router.put('/me/reset-password', auth, async (req, res) => {
    if (!req.user.email) return res.status(403).json({ error: 'not valid token' });
    const ifRest = await User.resetPassword(req.user._id, req.query.newPassword);
    if (!ifRest) return res.status(403).json({ error: 'not valid token or new password is required' });
    return res.status(204).json({ success: ' done ' });
})

router.put('/me/update', auth, async (req, res) => {
    const shcema = Joi.object().keys({
        email: Joi.string().trim().email().optional(),
        birthday: Joi.date().raw().optional(),
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        about: Joi.string().optional(),
        country: Joi.string().optional(),
        gender: Joi.string().optional()
    });
    Joi.validate(req.body, shcema, async (err, result) => {
        if (err) return res.status(500).json({ error: err });
        const updateSucces = await User.updateUserInfo(req.user._id, req.body.firstName, req.body.lastName, req.body.about, req.body.gender, req.body.country, req.body.email, req.body.birthDate);
        if (!updateSucces) return res.status(400).json({ error: 'there is an error' });
        return res.status(204).json({ success: ' done ' });
    })
})

router.put('/me/confirm-update-email', auth, async (req, res) => {
    if (!req.user.email || !req.user.newEmail || !req.user._id) return res.status(403).json({ error: 'not correct token' });
    if (req.query.type == 'changeEmail') {
        const user = await User.checkMAilExistAndFormat(req.user.email);
        if (!user || user == -1) return res.status(403).json({ error: 'this email not exist ' });
        sendmail(req.user.newEmail, req.header('x-auth-token'), 'set email', req.user.firstName);
        return res.status(204).json({ success: ' done ' })
    }
    if (req.query.type == 'resetEmail') {
        const user = await User.checkMAilExistAndFormat(req.user.newEmail);
        if (user || user == -1) return res.status(403).json({ error: 'this email aleardy exists ' });
        if (! await User.setEmail(req.user._id, req.user.newEmail))
            return res.status(400).json({ error: "not user or not email " });
        return res.status(204).json({ success: ' done ' });
    }
    return res.status(403).json({ error: 'not correct type' });
})

router.put('/me/follow-user/:user_id', auth, async (req, res) => {
    const ifFollow = await User.followUser(req.user._id, req.params.user_id);
    if (!ifFollow) return res.status(403).json({ error: 'one of users not correct' });
    if (ifFollow == -1) return res.status(400).json({ error: ' you follow this user !' });
    return res.status(204).json({ success: ' done ' });
})

router.delete('/me/follow-user/:user_id', auth, async (req, res) => {
    const ifFollow = await User.unfollowUser(req.user._id, req.params.user_id);
    if (!ifFollow) return res.status(403).json({ error: 'one of users not correct' });
    if (ifFollow == -1) return res.status(400).json({ error: ' you not follow this user !' });
    return res.status(204).json({ success: ' done ' });
})

router.get('/me/follow-user/:user_id', auth, async (req, res) => {
    const user = await User.getUserById(req.user._id);
    if (!user) return res.status(403).json({ error: 'main user is not correct' });
    const ifFollow = await User.checkFollowUser(user, req.params.user_id);
    return res.json({ follow: ifFollow });
})

module.exports = router;
