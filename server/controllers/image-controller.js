const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const  mongoose  = require('mongoose');

const Image={

    deleteImage: async function(imageId) {
        if(await checkMonooseObjectID([imageId])==0){return false;}
        var ObjectID = mongoose.Types.ObjectId(imageId);
        gfs.remove({_id:ObjectID,root:"images"},(err,gridStore)=>{
            if(err){
                return false;
            }
            else{
               return true;
            }
        })
    }
};

module.exports=Image;