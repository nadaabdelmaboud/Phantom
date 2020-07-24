import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface user extends Document {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  country: String;
  birthDate: Date;
  about: String;
  gender: String;
  socketId: String;
  profileImage: mongoose.Types.ObjectId;
  pins: Array<{
    id: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
  }>;
  savedPins: Array<{
    id: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
  }>;
  confirm: Boolean;
  fcmToken: String;
  notifications: [{}];
  offlineNotifications: [{}];
  followers: Array<mongoose.Types.ObjectId>;
  following: Array<mongoose.Types.ObjectId>;
  boards: [
    {
      boardId: mongoose.Types.ObjectId;
      name: String;
      createdAt: Date;
      isJoined: Boolean;
      joiners: Array<mongoose.Types.ObjectId>;
      followers: Array<mongoose.Types.ObjectId>;
      createdOrjoined: String;
    },
  ];
  viewState: string;
  counts: {
    likes: Number;
    comments: Number;
    repins: Number;
    saves: Number;
  };
  createdAt: Date;
}
