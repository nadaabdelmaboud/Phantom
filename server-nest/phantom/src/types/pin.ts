import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface reply extends Document {
  replier: mongoose.Types.ObjectId;
  reply: String;
  date: Date;
  likes: {
    counts: Number;
    likers: Array<mongoose.Types.ObjectId>;
  };
}
export interface comment extends Document {
  commenter: mongoose.Types.ObjectId;
  comment: String;
  date: Date;
  replies: Array<reply>;
  likes: {
    counts: Number;
    likers: Array<mongoose.Types.ObjectId>;
  };
}
export interface pin extends Document {
  imageId: mongoose.Types.ObjectId;
  imageWidth: Number;
  imageHeight: Number;
  url: String;
  title: String;
  topic: String;
  savers: Array<mongoose.Types.ObjectId>;
  creator: {
    firstName: String;
    lastName: String;
    id: mongoose.Types.ObjectId;
    profileUrl: String;
  };
  board: mongoose.Types.ObjectId;
  createdAt: Date;
  note: String;
  destLink: String;
  comments: Array<comment>;
  counts: {
    comments: Number;
    thanksReacts: Number;
    loveReacts: Number;
    wowReacts: Number;
    goodIdeaReacts: Number;
    hahaReacts: Number;
  };
  reacts: Array<{
    reactType: String;
    userId: mongoose.Types.ObjectId;
  }>;
}
