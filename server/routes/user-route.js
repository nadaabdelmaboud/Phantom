const router = require('express').Router();
const auth = require('../middlewares/auth-middleware');
const User = require('../controllers/user-controller');
var sendmail = require('../controllers/send-mail-controller');


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

module.exports = router;
