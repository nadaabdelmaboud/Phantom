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
  profileImage: mongoose.Types.ObjectId,
  pins: Array(mongoose.Types.ObjectId),
  savedPins: Array(mongoose.Types.ObjectId),
  confirm: Boolean,
  fcmToken: String,
  notifications: [{}],
  offlineNotifications: [{}],
  followers: Array(mongoose.Types.ObjectId),
  following: Array(mongoose.Types.ObjectId),
  boards: [
    {
      boardId: mongoose.Types.ObjectId,
      name: String,
      createdAt: Date,
      isJoined: Boolean,
      joiners: Array(mongoose.Types.ObjectId),
      followers: Array(mongoose.Types.ObjectId),
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
