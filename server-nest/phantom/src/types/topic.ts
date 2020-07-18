import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface topic extends Document {
  name: String;
  followers: [mongoose.Schema.Types.ObjectId];
  description: String;
  pins: [mongoose.Schema.Types.ObjectId];
  image: mongoose.Schema.Types.ObjectId;
  imageWidth: Number;
  imageHeight: Number;
}
