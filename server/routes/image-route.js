const router = require('express').Router();
const auth=require('../middlewares/auth-middleware')
const path=require('path')
const mongoose=require('mongoose')
const multer=require('multer')
const crypto=require('crypto')
const GridFsStorage=require('multer-gridfs-storage')
const Grid=require('gridfs-stream')
const bodyparser=require('body-parser')
const methodOverRide=require('method-override');
const uploadImage=require('../middlewares/image-upload')
router.post('/me/uploadImage',uploadImage.single('file'),async (req,res)=>{
    //to do 
    //type is needed to know what type of upload -- profileImage/Post whatever and then after uploading seccifully then add this image Id to the user
    return res.json({file:req.file})

})
router.get('/image',async(req,res)=>{
    //to do
    //should be done for specific images (id param should be added)
    gfs.files.find().toArray((err,files)=>{

        if(!files||files.length==0){
            return res.status(404).send("no images");
        }
        else{
            const readStream=gfs.createReadStream(files[0].filename)
            readStream.pipe(res)

        }
    })
})
module.exports=router;