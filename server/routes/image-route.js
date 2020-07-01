const router = require('express').Router();
const auth=require('../middlewares/auth-middleware')
const uploadImage=require('../middlewares/image-upload');
const  mongoose  = require('mongoose');
const checkMonooseObjectID = require('../controllers/validation-controller');
const Image=require('../controllers/image-controller');

router.post('/me/uploadImage',auth,uploadImage.single('file'),async (req,res)=>{

    if(req.file){
        return res.status(200).send({imageId:req.file.id});
    }
    else{
        return res.status(403).send("couldn't upload image");
    }

})
router.get('/image',async(req,res)=>{

    let id=req.query.id;
    var ObjectID = mongoose.Types.ObjectId(id);
    gfs.files.find({_id:ObjectID}).toArray((err,files)=>{

        if(!files||files.length==0){
            return res.status(404).send("no images");
        }
        else{
            const readStream=gfs.createReadStream(files[0].filename)
            readStream.pipe(res)
        }
    })
})
router.delete('/image',auth,async(req,res)=>{

   let deleted=await Image.deleteImage(req.query.id);
        if(deleted){
            return res.status(404).send("cant delete image");
        }
        else{
           return res.status(200).send("image deleted successfully");
        }
})
module.exports=router;