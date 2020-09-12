import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
export const User = new Schema({
  recentSearch: Array(String),
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  country: String,
  birthDate: Date,
  followingTopics: Array(mongoose.Types.ObjectId),
  location: String,
  activateaccount: Boolean,
  notificationCounter: Number,
  activity: Boolean,
  invitation: Boolean,
  boardUpdate: Boolean,
  followNotification: Boolean,
  pinsNotification: Boolean,
  facebook: Boolean,
  google: Boolean,
  notificationOfPinsActivity: Boolean,
  userName: String,
  boardsForYou: Boolean,
  pinsForYou: Boolean,
  pinsInspired: Boolean,
  popularPins: Boolean,
  about: String,
  sortType: String,
  gender: String,
  socketId: String,
  homeFeed: Array(Object),
  history: Array({
    topic: String,
    pinId: mongoose.Types.ObjectId,
  }),
  profileImage: mongoose.Types.ObjectId,
  pins: Array({
    pinId: mongoose.Types.ObjectId,
    boardId: mongoose.Types.ObjectId,
    sectionId: mongoose.Types.ObjectId,
  }),
  sentMessages: Array({
    message: Array({
      note: String,
      time: Date,
    }),
    userId: mongoose.Types.ObjectId,
  }),
  recievedMessages: Array({
    message: Array({
      note: String,
      time: Date,
    }),
    userId: mongoose.Types.ObjectId,
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

User.index({ firstName: String, lastName: String });
