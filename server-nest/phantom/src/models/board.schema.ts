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
  collaborators: [
    {
      id: mongoose.Types.ObjectId,
      savePin: Boolean,
      createPin: Boolean,
      editTitle: Boolean,
      editDescription: Boolean,
      personalization: Boolean,
      addCollaborators: Boolean,
    },
  ],
  isJoined: Boolean,
  followers: Array(mongoose.Types.ObjectId),
  counts: {
    followers: Number,
    joiners: Number,
    pins: Number,
  },
});
