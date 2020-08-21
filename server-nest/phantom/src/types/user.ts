import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export interface user extends Document {
  firstName: String;
  lastName: String;
  userName: String;
  location: String;
  email: String;
  password: String;
  country: String;
  birthDate: Date;
  about: String;
  gender: String;
  sortType: String;
  socketId: string;
  profileImage: mongoose.Types.ObjectId;
  history: Array<{
    topic: String;
    pinId: mongoose.Types.ObjectId;
  }>;
  pins: Array<{
    pinId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    sectionId: mongoose.Types.ObjectId;
  }>;
  savedPins: Array<{
    pinId: mongoose.Types.ObjectId;
    boardId: mongoose.Types.ObjectId;
    sectionId: mongoose.Types.ObjectId;
    note: String;
  }>;
  sentMessages: Array<{
    message: Array<{
      note: String;
      time: Date;
    }>;
    userId: mongoose.Types.ObjectId;
  }>;
  recievedMessages: Array<{
    message: Array<{
      note: String;
      time: Date;
    }>;
    userId: mongoose.Types.ObjectId;
  }>;
  confirm: Boolean;
  fcmToken: String;
  followingTopics: Array<mongoose.Types.ObjectId>;
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
