const router = require('express').Router();
const auth=require('../middlewares/auth-middleware')
router.post('/me/pins',auth,async (req,res)=>{


})
module.exports=router;