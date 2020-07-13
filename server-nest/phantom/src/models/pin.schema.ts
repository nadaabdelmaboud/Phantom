import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const Pin = new Schema({
  imageId: mongoose.Schema.Types.ObjectId,
  imageWidth: Number,
  imageHeight: Number,
  url: String,
  title: String,
  creator: {
    firstName: String,
    lastName: String,
    id: mongoose.Schema.Types.ObjectId,
    profileUrl: String,
  },
  board: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  note: String,
  destLink: String,
  comments: [
    {
      commenter: mongoose.Schema.Types.ObjectId,
      comment: String,
      date: Date,
      replies: [
        {
          replier: mongoose.Schema.Types.ObjectId,
          reply: String,
          date: Date,
          likes: {
            counts: Number,
            likers: [mongoose.Schema.Types.ObjectId],
          },
        },
      ],
      likes: {
        counts: Number,
        likers: [mongoose.Schema.Types.ObjectId],
      },
    },
  ],
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
      userId: mongoose.Schema.Types.ObjectId,
    },
  ],
});
