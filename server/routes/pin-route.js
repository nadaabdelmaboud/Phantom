const router = require('express').Router();
const auth=require('../middlewares/auth-middleware')
const Pin=require('../controllers/pin-controller');
const Image=require('../controllers/image-controller');

router.post('/me/pins',auth,async (req,res)=>{

    let imageId=req.body.imageId;
    let imageWidth=req.body.imageWidth;
    let imageHeight=req.body.imageHeight;
    let userId=req.user._id;
    let note=req.body.note;
    let title=req.body.title;
    let board=req.body.board;
    let link=(req.body.link)?req.body.link:"";
    let createdPin=await Pin.createPin(userId,imageId,title,note,link,board,imageWidth,imageHeight);
    if(createdPin){
         return res.status(200).send(createdPin);
    }
    else{
        await Image.deleteImage(imageId);
        return res.status(400).send("pin not created");
    }

})
//get all user created pins
router.get('/me/pins',auth,async (req,res)=>{

    let userId=req.user._id;
    let pins=await Pin.getCurrentUserPins(userId);
    if(pins&&pins.length!=0){
         return res.status(200).send(pins);
    }
    else{
        return res.status(404).send("pins not found");
    }

})
router.post('/me/savedPins/:id',auth,async (req,res)=>{

    let pinId=req.params.id;
    let userId=req.user._id;
    let savedPin=await Pin.savePin(userId,pinId,boardId);
    if(savedPin){
         return res.status(200).send("pin saved succissfully");
    }
    else{
        return res.status(400).send("pin not saved");
    }

})
//get all user saved pins
router.get('/me/savedPins',auth,async (req,res)=>{

    let userId=req.user._id;
    let pins=await Pin.getCurrentUserSavedPins(userId);
    if(pins&&pins.length!=0){
         return res.status(200).send(pins);
    }
    else{
        return res.status(404).send("pins not found");
    }

})
module.exports=router;