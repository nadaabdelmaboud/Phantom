import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const Board = new Schema({
  url: String,
  name: String,
  startDate: String,
  endDate: String,
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
  pins: Array({
    pinId: mongoose.Types.ObjectId,
    topic: String,
  }),
  createdAt: Date,
  sections: [
    {
      sectionId: mongoose.Types.ObjectId,
      sectionName: String,
      pins: Array({
        pinId: mongoose.Types.ObjectId,
        topic: String,
      }),
      creatorId: mongoose.Types.ObjectId,
      coverImages: [mongoose.Types.ObjectId],
    },
  ],
  collaborators: [
    {
      collaboratorId: mongoose.Types.ObjectId,
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
Board.index({
  name: 'text',
  topic: 'text',
  description: 'text',
  status: 'text',
});
