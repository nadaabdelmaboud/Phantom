import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface reply extends Document {
  replier: mongoose.Schema.Types.ObjectId;
  reply: String;
  date: Date;
  likes: {
    counts: Number;
    likers: Array<mongoose.Schema.Types.ObjectId>;
  };
}
export interface comment extends Document {
  commenter: mongoose.Schema.Types.ObjectId;
  comment: String;
  date: Date;
  replies: Array<reply>;
  likes: {
    counts: Number;
    likers: Array<mongoose.Schema.Types.ObjectId>;
  };
}
export interface pin extends Document {
  imageId: mongoose.Schema.Types.ObjectId;
  imageWidth: Number;
  imageHeight: Number;
  url: String;
  title: String;
  creator: {
    firstName: String;
    lastName: String;
    id: mongoose.Schema.Types.ObjectId;
    profileUrl: String;
  };
  board: mongoose.Schema.Types.ObjectId;
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
    userId: mongoose.Schema.Types.ObjectId;
  }>;
}
