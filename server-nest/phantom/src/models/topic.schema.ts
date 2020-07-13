import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const Topic = new Schema({
  name: String,
  followers: [mongoose.Schema.Types.ObjectId],
  description: String,
  pins: [mongoose.Schema.Types.ObjectId],
  image: mongoose.Schema.Types.ObjectId,
  imageWidth: Number,
  imageHeight: Number,
});
