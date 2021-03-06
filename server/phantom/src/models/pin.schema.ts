import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const Pin = new Schema({
  imageId: String,
  driveImageId: String,
  imageWidth: Number,
  imageHeight: Number,
  url: String,
  title: { type: String, index: true },
  creator: {
    firstName: String,
    lastName: String,
    id: mongoose.Types.ObjectId,
    profileUrl: String,
  },
  savers: Array(mongoose.Types.ObjectId),
  board: mongoose.Types.ObjectId,
  section: mongoose.Types.ObjectId,
  createdAt: Date,
  topic: String,
  note: { type: String, index: true },
  destLink: String,
  comments: Array({
    commenter: mongoose.Types.ObjectId,
    comment: String,
    date: Date,
    replies: [
      {
        replier: mongoose.Types.ObjectId,
        reply: String,
        date: Date,
        likes: {
          counts: Number,
          likers: [mongoose.Types.ObjectId],
        },
      },
    ],
    likes: {
      counts: Number,
      likers: [mongoose.Types.ObjectId],
    },
  }),
  more: Array(Object),
  counts: {
    comments: Number,
    thanksReacts: Number,
    loveReacts: Number,
    wowReacts: Number,
    goodIdeaReacts: Number,
    hahaReacts: Number,
  },
  reacts: [
    {
      reactType: String,
      userId: mongoose.Types.ObjectId,
    },
  ],
});
Pin.index({ title: 'text', note: 'text' });
