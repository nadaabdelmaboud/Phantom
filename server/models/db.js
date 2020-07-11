const mongoose = require("mongoose");
const { number } = require("joi");
const Schema = mongoose.Schema;
const User = new Schema({
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
  pins: [mongoose.Schema.Types.ObjectId],
  savedPins: [mongoose.Schema.Types.ObjectId],
  confirm: Boolean,
  fcmToken: String,
  notifications: [{}],
  offlineNotifications: [{}],
  followers: [mongoose.Schema.Types.ObjectId],
  following: [mongoose.Schema.Types.ObjectId],
  boards: [
    {
      boardId: mongoose.Schema.Types.ObjectId,
      isJoined: Boolean,
      joiners: [mongoose.Schema.Types.ObjectId],
      followers: [mongoose.Schema.Types.ObjectId],
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
const Board = new Schema({
  url: String,
  name: String,
  creator: {
    firstName: String,
    lastName: String,
    id: mongoose.Schema.Types.ObjectId,
    profileUrl: String,
  },
  pins: [mongoose.Schema.Types.ObjectId],
  createdAt: Date,
  counts: {
    followers: Number,
    joiners: Number,
    pins: Number,
  },
});
const Pin = new Schema({
  imageId: mongoose.Schema.Types.ObjectId,
  imageWidth: Number,
  imageHeight: Number,
  url: String,
  title: String,
  creator: {
    firstName: String,
    lastName: String,
    id: mongoose.Schema.Types.ObjectId,
    profileUrl: String,
  },
  board: mongoose.Schema.Types.ObjectId,
  createdAt: Date,
  note: String,
  destLink: String,
  comments: [
    {
      commenter: mongoose.Schema.Types.ObjectId,
      comment: String,
      date: Date,
      replies: [
        {
          replier: mongoose.Schema.Types.ObjectId,
          reply: String,
          date: Date,
          likes: {
            counts: Number,
            likers: [mongoose.Schema.Types.ObjectId],
          },
        },
      ],
      likes: {
        counts: Number,
        likers: [mongoose.Schema.Types.ObjectId],
      },
    },
  ],
  counts: {
    comments: Number,
    thanksReacts: Number,
    loveReacts: Number,
    wowReacts: Number,
    goodIdeaReacts: Number,
    hahaReacts: Number,
  },
  reacts: [
    {
      reactType: String,
      userId: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const Category = new Schema({
  name: String,
  pins: [mongoose.Schema.Types.ObjectId],
});

const Topic = new Schema({
  name: String,
  followers: [mongoose.Schema.Types.ObjectId],
  description: String,
  pins: [mongoose.Schema.Types.ObjectId],
  image: mongoose.Schema.Types.ObjectId,
  imageWidth: Number,
  imageHeight: Number,
});

const user = mongoose.model("User", User);
const category = mongoose.model("Category", Category);
const topic = mongoose.model("Topic", Topic);
const pin = mongoose.model("Pin", Pin);
const board = mongoose.model("Board", Board);

module.exports = { user, topic, category, pin, board };
