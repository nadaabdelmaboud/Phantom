import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const Chat = new Schema({
    name: String,
    usersIds: Array(String),
    lastMessage: {
        userId: String,
        message: String,
        date: Date
    },
    date: Date

});

