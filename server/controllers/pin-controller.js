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
};

module.exports=Pin;