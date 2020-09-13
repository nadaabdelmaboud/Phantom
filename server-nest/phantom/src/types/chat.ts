import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface chat extends Document {
    name: String,
    usersIds: Array<String>,
    lastMessage: {
        userId: String,
        message: String,
        date: Date

    }
    date: Date

};

