import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface topic extends Document {
  name: String;
  followers: Array<mongoose.Types.ObjectId>;
  description: String;
  pins: [mongoose.Types.ObjectId];
  imageWidth: Number;
  imageHeight: Number;
  recommendedUsers: Array<mongoose.Types.ObjectId>;
  imageId: mongoose.Types.ObjectId;
}
