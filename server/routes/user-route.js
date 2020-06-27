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
module.exports = router;
