const { user: userDocument, board: boardDocument, pin: pinDocument, image: imageDocument, category: categoryDocument } = require('../models/db');
const checkMonooseObjectID = require('./validation-controller');
const User=require('./user-controller');
const Board={
    getBoardById:async function(boardId){
        try {
            if (!checkMonooseObjectID([boardId])) throw new Error('not mongoose id');
            const board = await boardDocument.findById(boardId);
            return board;
        } catch (ex) { return 0; }
    },
    addPintoBoard: async function(pinId,boardId) {
        if(await checkMonooseObjectID([pinId,boardId])==0){return false;}
        let board=await this.getBoardById(boardId);
        if(!board)return false;
        let pin=await pinDocument.findById(pinId);
        if(!pin)return false;
        board.pins.push(pinId);
        board.counts.pins+=1;
        await board.save();
        return true;
    },
    createBoard: async function(name,userId) {
        let user=await User.getUserById(userId);
        if(!user)return 0;
        let board=new boardDocument({
            name: name,
            pins:[],
            createdAt: Date.now(),
            counts: {
                followers: 0,
                joiners: 0,
                pins: 0
            },
            creator: {
                firstName: user.firstName,
                lastName: user.lastName,
                id: userId,
            }
        });
        await board.save();
        await this.addBoardtoUser(userId,board._id);
        return board;
    },
    addBoardtoUser: async function(userId,boardId) {
        if(await checkMonooseObjectID([userId,boardId])==0){return false;}
        let board=await this.getBoardById(boardId);
        if(!board)return false;
        let user=await userDocument.findById(userId);
        if(!user)return false;
        user.boards.push({
            boardId: boardId,
            isJoined: false,
            joiners: [],
            followers: []
        });
        await user.save();
        return true;
    },
    getCurrentUserBoards:async function(userId) {
        if(await checkMonooseObjectID([userId])==0){return false;}
        let user=await userDocument.findById(userId);
        if(!user)return false;
        let allBoards=await boardDocument.find({});
        console.log(allBoards);
        let retBoards=[];
        for(var i=0;i<user.boards.length;i++){
            for(var j=0;j<allBoards.length;j++){
                if(String(user.boards[i].boardId)==String(allBoards[j]._id)){
                    retBoards.push(allBoards[j]);
                }
            }
        }
        return retBoards;
    }
};

module.exports=Board;