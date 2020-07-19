import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
export const User = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  country: String,
  birthDate: Date,
  about: String,
  gender: String,
  socketId: String,
  profileImage: mongoose.Schema.Types.ObjectId,
  pins: Array(mongoose.Schema.Types.ObjectId),
  savedPins: Array(mongoose.Schema.Types.ObjectId),
  confirm: Boolean,
  fcmToken: String,
  notifications: [{}],
  offlineNotifications: [{}],
  followers: Array(mongoose.Schema.Types.ObjectId),
  following: Array(mongoose.Schema.Types.ObjectId),
  boards: [
    {
      boardId: mongoose.Schema.Types.ObjectId,
      name: String,
      createdAt: Date,
      isJoined: Boolean,
      joiners: Array(mongoose.Schema.Types.ObjectId),
      followers: Array(mongoose.Schema.Types.ObjectId),
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
