import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const Pin = new Schema({
  imageId: mongoose.Types.ObjectId,
  imageWidth: Number,
  imageHeight: Number,
  url: String,
  title: String,
  creator: {
    firstName: String,
    lastName: String,
    id: mongoose.Types.ObjectId,
    profileUrl: String,
  },
  savers: Array(mongoose.Types.ObjectId),
  board: mongoose.Types.ObjectId,
  createdAt: Date,
  topic: String,
  note: String,
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
