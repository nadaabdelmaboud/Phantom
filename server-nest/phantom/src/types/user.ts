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
  profileImage: mongoose.Schema.Types.ObjectId;
  pins: Array<mongoose.Schema.Types.ObjectId>;
  savedPins: Array<mongoose.Schema.Types.ObjectId>;
  confirm: Boolean;
  fcmToken: String;
  notifications: [{}];
  offlineNotifications: [{}];
  followers: Array<mongoose.Schema.Types.ObjectId>;
  following: Array<mongoose.Schema.Types.ObjectId>;
  boards: [
    {
      boardId: mongoose.Schema.Types.ObjectId;
      isJoined: Boolean;
      joiners: Array<mongoose.Schema.Types.ObjectId>;
      followers: Array<mongoose.Schema.Types.ObjectId>;
    },
  ];
  counts: {
    likes: Number;
    comments: Number;
    repins: Number;
    saves: Number;
  };
  createdAt: Date;
}
