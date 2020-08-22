import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface chat extends Document {
    usersIds: Array<mongoose.Types.ObjectId>,
    messages:Array<{
        userId: mongoose.Types.ObjectId,
        notes: Array<{
            message:String,
            date:Date
        }>
    }>
};

