import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface topic extends Document {
  name: String;
  followers: [mongoose.Types.ObjectId];
  description: String;
  pins: [mongoose.Types.ObjectId];
  image: mongoose.Types.ObjectId;
  imageWidth: Number;
  imageHeight: Number;
}
