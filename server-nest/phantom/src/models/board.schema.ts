import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const Board = new Schema({
  url: String,
  name: String,
  startDate:Date,
  endDate:Date,
  status:String,
  creator: {
    firstName: String,
    lastName: String,
    id: mongoose.Schema.Types.ObjectId,
    profileUrl: String,
  },
  pins: [mongoose.Schema.Types.ObjectId],
  createdAt: Date,
  counts: {
    followers: Number,
    joiners: Number,
    pins: Number,
  },
});
