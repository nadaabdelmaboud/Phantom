import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface section extends Document {
  sectionName: String;
  more: Array<Object>;
  pins: Array<{
    pinId: mongoose.Types.ObjectId;
    topic: String;
  }>;
  creatorId: mongoose.Types.ObjectId;
  coverImages: Array<String>;
}
export interface board extends Document {
  url: String;
  name: String;
  startDate: String;
  more: Array<Object>;
  endDate: String;
  status: String;
  topic: String;
  description: String;
  personalization: Boolean;
  creator: {
    firstName: String;
    lastName: String;
    id: mongoose.Types.ObjectId;
    profileUrl: String;
  };
  coverImages: Array<String>;
  collaborators: Array<{
    collaboratorId: mongoose.Types.ObjectId;
    savePin: Boolean;
    createPin: Boolean;
    editDescription: Boolean;
    personalization: Boolean;
    editTitle: Boolean;
    addCollaborators: Boolean;
  }>;
  sections: Array<section>;
  isJoined: Boolean;
  followers: Array<mongoose.Types.ObjectId>;
  pins: Array<{
    pinId: mongoose.Types.ObjectId;
    topic: String;
  }>;
  createdAt: Date;
  counts: {
    followers: Number;
    joiners: Number;
    pins: Number;
  };
}
