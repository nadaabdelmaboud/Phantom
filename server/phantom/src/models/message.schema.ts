import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const Message = new Schema({
    chatId: String,
    senderId: String,
    message: String,
    date: Date,
    deliverStatus: Array({
        userId: String,
        time: Date
    }),
    seenStatus: Array({
        userId: String,
        time: Date
    }),
    senderDelete: Boolean
});
