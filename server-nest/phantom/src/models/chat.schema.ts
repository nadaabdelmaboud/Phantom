import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const Chat = new Schema({
 usersIds: Array(mongoose.Types.ObjectId),
 messages:Array({
     userId: mongoose.Types.ObjectId,
     notes: Array({
        message:String,
        date:Date
    })
 })

});

