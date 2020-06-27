const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const User=require('./user-controller');
const Board=require('./board-controller')
const Pin={
    getPinById:async function(pinId){
        try {
            if (!checkMonooseObjectID([pinId])) throw new Error('not mongoose id');
            const pin = await pinDocument.findById(pinId);
            return pin;
        } catch (ex) { return 0; }
    },
    createPin: async function(userId,imageId,title,note,link,board,imageWidth,imageHeight) {
        let user=await User.getUserById(userId);
        if(!user)return 0;
        let pin=new pinDocument({
            imageId: imageId,
            imageWidth:imageWidth,
            imageHeight:imageHeight,
            destLink:link,
            title:title,
            creator: {
                firstName: user.firstName,
                lastName: user.lastName,
                id: userId,
            },
            board: board,
            createdAt: Date.now(),
            note: note,
            comments:[],
            counts: {
                comments: 0,
                thanksReacts: 0,
                loveReacts: 0,
                wowReacts: 0,
                goodIdeaReacts: 0,
                hahaReacts: 0,
            },
            reacts: []
        });
        await pin.save();
        await Board.addPintoBoard(pin._id,board);
        await this.addPintoUser(userId,pin._id);
        return pin;
    },
    addPintoUser: async function(userId,pinId) {
        if(await checkMonooseObjectID([userId,pinId])==0){return false;}
        let pin=await this.getPinById(pinId);
        if(!pin)return false;
        let user=await userDocument.findById(userId);
        if(!user)return false;
        user.pins.push(pinId);
        await user.save();
        return true;
    },
    getCurrentUserPins:async function(userId) {
        if(await checkMonooseObjectID([userId])==0){return false;}
        let user=await userDocument.findById(userId);
        if(!user)return false;
        let allPins=await pinDocument.find({});
        let retPins=[];
        for(var i=0;i<user.pins.length;i++){
            for(var j=0;j<allPins.length;j++){
                if(String(user.pins[i])==String(allPins[j]._id)){
                    retPins.push(allPins[j]);
                }
            }
        }
        return retPins;
    },
    savePin: async function(userId,pinId,boardId) {
        if(await checkMonooseObjectID([userId,pinId])==0){return false;}
        let user=await User.getUserById(userId);
        if(!user)return 0;
        let pin=await this.getPinById(pinId);
        if(!pin)return false;
        let found=false;
        for(var i=0;i<user.savedPins.length;i++){
                if(String(user.savedPins[i])==String(pinId)){
                    found=true;
                    break;
                }
        }
        if(!found){
            user.savedPins.push(pinId);
        }
        else{
            return false;
        }
        if(boardId&&boardId!=undefined){
           if(await checkMonooseObjectID([boardId])!=0){
            await Board.addPintoBoard(pinId,boardId);
           }
        }
        await user.save();
        return true;
    },
    getCurrentUserSavedPins:async function(userId) {
        if(await checkMonooseObjectID([userId])==0){return false;}
        let user=await userDocument.findById(userId);
        if(!user)return false;
        let allPins=await pinDocument.find({});
        let retPins=[];
        for(var i=0;i<user.savedPins.length;i++){
            for(var j=0;j<allPins.length;j++){
                if(String(user.savedPins[i])==String(allPins[j]._id)){
                    retPins.push(allPins[j]);
                }
            }
        }
        return retPins;
    },
};

module.exports=Pin;