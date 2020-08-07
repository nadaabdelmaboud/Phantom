import * as mongoose from 'mongoose';
import * as mongoosastic from 'mongoosastic'
import { hostname } from 'os';
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
  board: mongoose.Types.ObjectId,
  createdAt: Date,
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
Pin.index({title:"text",note:"text"});
