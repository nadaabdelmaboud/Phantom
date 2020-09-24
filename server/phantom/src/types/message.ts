
import { Document } from 'mongoose';
export interface message extends Document {
    chatId: String,
    senderId: String,
    message: String,
    date: Date,
    deliverStatus: Array<{
        userId: String,
        time: Date
    }>
    seenStatus: Array<{
        userId: String,
        time: Date
    }>
};

