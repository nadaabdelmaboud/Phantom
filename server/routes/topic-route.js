const router = require('express').Router();
const auth=require('../middlewares/auth-middleware')
const Pin=require('../controllers/pin-controller');
const Image=require('../controllers/image-controller');
const Topic=require('../controllers/topic-controller');

//get all the topics
router.get('/topic',auth,async (req,res)=>{
    let userId=req.user._id;
    let topics = await Topic.getTopics(userId);
    if(topics){
         return res.status(200).send(topics);
    }
    else{
        return res.status(404).send("Topics not found");
    }

})
router.post('/topic/addPin',auth,async (req,res)=>{
    let userId=req.user._id;
    let pinId=req.body.pinId;
    let topicId=req.body.topicId;
    let topics = await Topic.addPinToTopic(topicId,pinId,userId);
    if(topics){
         return res.status(200);
    }
    else{
        return res.status(400).send("Pin cannot be added to the topic");
    }

})
//get a certain topic
router.get('/topic/:topicId',auth,async (req,res)=>{

    let userId=req.user._id;
    let topicId=req.params.topicId;
    let topic=await Topic.getTopicById(topicId, userId);
    if(topic){
         return res.status(200).send(topic);
    }
    else{
        return res.status(404).send("topic not found");
    }

})
//get all pins of a certain topic
router.get('/topic/:topicId/pins',auth,async (req,res)=>{

    let userId=req.user._id;
    let topicId=req.params.topicId;
    let pins=await Topic.getPinsOfTopic(topicId, userId);
    if(pins&&pins.length!=0){
         return res.status(200).send(pins);
    }
    else{
        return res.status(404).send("pins not found");
    }

})
router.post('/createTopic',auth,async (req,res)=>{

    let userId=req.user._id;
    let imageId=req.body.imageId;
    let imageHeight=req.body.imageHeight;
    let imageWidth=req.body.imageWidth;
    let description=req.body.description;
    let name=req.body.name;
    let topic=await Topic.createTopic(imageId, description, imageWidth, imageHeight, name, userId);
    if(topic){
         return res.status(200).send(topic);
    }
    else{
        await Image.deleteImage(imageId);
        return res.status(400).send("Topic not created");
    }

})

module.exports=router;