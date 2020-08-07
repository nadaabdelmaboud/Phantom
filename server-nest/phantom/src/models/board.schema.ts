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
    id: mongoose.Types.ObjectId,
    profileUrl: String,
  },
  coverImages: [mongoose.Types.ObjectId],
  pins: [mongoose.Types.ObjectId],
  createdAt: Date,
  collaborators: [mongoose.Types.ObjectId],
  isJoined: Boolean,
  followers: Array(mongoose.Types.ObjectId),
  counts: {
    followers: Number,
    joiners: Number,
    pins: Number,
  },
});
Board.index({name:"text",topic:"text",description:"text",status:"text"});
