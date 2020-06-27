const router = require('express').Router();
const auth=require('../middlewares/auth-middleware')
const Pin=require('../controllers/pin-controller');
const Image=require('../controllers/image-controller');
const Board=require('../controllers/board-controller');
router.post('/me/boards',auth,async (req,res)=>{

    let boardName=req.body.name;
    let userId=req.user._id;
    let createdBoard=await Board.createBoard(boardName,userId);
    if(createdBoard){
         return res.status(200).send(createdBoard);
    }
    else{
        return res.status(400).send("board not created");
    }

})
module.exports=router;