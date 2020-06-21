const mongoose=require('mongoose')
const user=new mongoose.Schema({
firstName:String,
lastName:String,
email:String,
password:String,
country:String,
birthDate:Date,
about:String,
profileImage:mongoose.Schema.Types.ObjectId,
pins:[mongoose.Schema.Types.ObjectId],
uploadedImages:[mongoose.Schema.Types.ObjectId],
savedImages:[mongoose.Schema.Types.ObjectId],
confirm:Boolean,
fcmToken:String,
notifications:[{}],
offlineNotifications:[{}],
followers:[mongoose.Schema.Types.ObjectId],
following:[mongoose.Schema.Types.ObjectId],
boards:[{
    boardId:mongoose.Schema.Types.ObjectId,
    isJoined:Boolean,
    joiners:[mongoose.Schema.Types.ObjectId],
    followers:[mongoose.Schema.Types.ObjectId]
}],
counts: {
    likes: Number,
    comments: Number,
    repins: Number,
    saves: Number
  },
createdAt:Date,


});
const board=new mongoose.Schema({
    url:String,
    name:String,
    creator:{
        firstName:String,
        lastName:String,
        id:mongoose.Schema.Types.ObjectId,
        profileUrl:String
    },
    createdAt:Date,
    counts: {
        followers: Number,
        joiners: Number,
        pins: Number
      },

});
const pin=new mongoose.Schema({
    imageId:mongoose.Schema.Types.ObjectId,
    url:String,
    creator:{
        firstName:String,
        lastName:String,
        id:mongoose.Schema.Types.ObjectId,
        profileUrl:String
    }, 
    board:mongoose.Schema.Types.ObjectId,
    createdAt:Date,
    note:String,
    color:String,
    counts:	{
        comments:Number,
        thanksReacts:Number,
        loveReacts:Number,
        wowReacts:Number,
        goodIdeaReacts:Number,
        hahaReacts:Number,
    },
    reacts:[{
        type:String,
        userId:mongoose.Schema.Types.ObjectId
    }]
    
});

const category=new mongoose.Schema({
    name:String,
    pins:[mongoose.Schema.Types.ObjectId]
});

const image=new mongoose.Schema({
    height:Number,
    width:Number,
    url:String
});

const topic=new mongoose.Schema({
    name:String,
    followers:[],
    description:String,
    pins:[mongoose.Schema.Types.ObjectId]
});

module.exports = { user, topic, category,pin }