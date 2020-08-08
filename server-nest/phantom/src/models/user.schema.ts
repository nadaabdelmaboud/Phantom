import * as mongoose from 'mongoose';
import * as mongoosastic from 'mongoosastic'

const Schema = mongoose.Schema;
export const User = new Schema({
  firstName:  String,
  lastName:  String,
  email: String,
  password: String,
  country: String,
  birthDate: Date,
  followingTopics: Array(mongoose.Types.ObjectId),
  location: String,
  userName: String,
  about: String,
  sortType: String,
  gender: String,
  socketId: String,
  profileImage: mongoose.Types.ObjectId,
  pins: Array({
    pinId: mongoose.Types.ObjectId,
    boardId: mongoose.Types.ObjectId,
    sectionId: mongoose.Types.ObjectId,
  }),
  savedPins: Array({
    pinId: mongoose.Types.ObjectId,
    boardId: mongoose.Types.ObjectId,
    sectionId: mongoose.Types.ObjectId,
    note: String,
  }),
  confirm: Boolean,
  fcmToken: String,
  notifications: [{}],
  offlineNotifications: [{}],
  followers: Array(mongoose.Types.ObjectId),
  following: Array(mongoose.Types.ObjectId),
  viewState: String,
  boards: [
    {
      boardId: mongoose.Types.ObjectId,
      name: String,
      createdAt: Date,
      isJoined: Boolean,
      createdOrjoined: String,
    },
  ],
  counts: {
    likes: Number,
    comments: Number,
    repins: Number,
    saves: Number,
  },
  createdAt: Date,
});

User.index({firstName:String, lastName:String})
