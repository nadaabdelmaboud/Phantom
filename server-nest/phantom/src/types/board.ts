import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface board extends Document {
  url: String;
  name: String;
  startDate: Date;
  endDate: Date;
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
  coverImages: Array<mongoose.Types.ObjectId>;
  collaborators: Array<{
    id: mongoose.Types.ObjectId;
    savePin: Boolean;
    createPin: Boolean;
    editDescription: Boolean;
    personalization: Boolean;
    editTitle: Boolean;
    addCollaborators: Boolean;
  }>;
  isJoined: Boolean;
  followers: Array<mongoose.Types.ObjectId>;
  pins: Array<mongoose.Types.ObjectId>;
  createdAt: Date;
  counts: {
    followers: Number;
    joiners: Number;
    pins: Number;
  };
}
