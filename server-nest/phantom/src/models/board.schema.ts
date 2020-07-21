import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const Board = new Schema({
  url: String,
  name: String,
  startDate: Date,
  endDate: Date,
  status: String,
  topic: String,
  description: String,
  personalization: Boolean,
  creator: {
    firstName: String,
    lastName: String,
    id: mongoose.Schema.Types.ObjectId,
    profileUrl: String,
  },
  pins: [mongoose.Schema.Types.ObjectId],
  createdAt: Date,
  collaborators: [mongoose.Schema.Types.ObjectId],
  counts: {
    followers: Number,
    joiners: Number,
    pins: Number,
  },
});
