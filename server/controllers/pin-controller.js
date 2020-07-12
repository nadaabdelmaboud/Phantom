const {
  user: userDocument,
  board: boardDocument,
  pin: pinDocument,
  image: imageDocument,
  category: categoryDocument,
} = require("../models/db");
const checkMonooseObjectID = require("./validation-controller");
const User = require("./user-controller");
const Board = require("./board-controller");
const Pin = {
  getPinById: async function (pinId) {
    try {
      if (!checkMonooseObjectID([pinId])) throw new Error("not mongoose id");
      const pin = await pinDocument.findById(pinId);
      return pin;
    } catch (ex) {
      return 0;
    }
  },
  createPin: async function (
    userId,
    imageId,
    title,
    note,
    link,
    board,
    imageWidth,
    imageHeight
  ) {
    let user = await User.getUserById(userId);
    if (!user) return 0;
    let pin = new pinDocument({
      imageId: imageId,
      imageWidth: imageWidth,
      imageHeight: imageHeight,
      destLink: link,
      title: title,
      creator: {
        firstName: user.firstName,
        lastName: user.lastName,
        id: userId,
      },
      board: board,
      createdAt: Date.now(),
      note: note,
      comments: [],
      counts: {
        comments: 0,
        thanksReacts: 0,
        loveReacts: 0,
        wowReacts: 0,
        goodIdeaReacts: 0,
        hahaReacts: 0,
      },
      reacts: [],
    });
    await pin.save();
    await Board.addPintoBoard(pin._id, board);
    await this.addPintoUser(userId, pin._id);
    return pin;
  },
  addPintoUser: async function (userId, pinId) {
    if ((await checkMonooseObjectID([userId, pinId])) == 0) {
      return false;
    }
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let user = await userDocument.findById(userId);
    if (!user) return false;
    user.pins.push(pinId);
    await user.save();
    return true;
  },
  getCurrentUserPins: async function (userId) {
    if ((await checkMonooseObjectID([userId])) == 0) {
      return false;
    }
    let user = await userDocument.findById(userId);
    if (!user) return false;
    let allPins = await pinDocument.find({});
    let retPins = [];
    for (var i = 0; i < user.pins.length; i++) {
      for (var j = 0; j < allPins.length; j++) {
        if (String(user.pins[i]) == String(allPins[j]._id)) {
          retPins.push(allPins[j]);
        }
      }
    }
    return retPins;
  },
  savePin: async function (userId, pinId, boardId) {
    if ((await checkMonooseObjectID([userId, pinId])) == 0) {
      return false;
    }
    let user = await User.getUserById(userId);
    if (!user) return 0;
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let found = false;
    for (var i = 0; i < user.savedPins.length; i++) {
      if (String(user.savedPins[i]) == String(pinId)) {
        found = true;
        break;
      }
    }
    if (!found) {
      user.savedPins.push(pinId);
    } else {
      return false;
    }
    if (boardId && boardId != undefined) {
      if ((await checkMonooseObjectID([boardId])) != 0) {
        await Board.addPintoBoard(pinId, boardId);
      }
    }
    await user.save();
    return true;
  },
  getCurrentUserSavedPins: async function (userId) {
    if ((await checkMonooseObjectID([userId])) == 0) {
      return false;
    }
    let user = await userDocument.findById(userId);
    if (!user) return false;
    let allPins = await pinDocument.find({});
    let retPins = [];
    for (var i = 0; i < user.savedPins.length; i++) {
      for (var j = 0; j < allPins.length; j++) {
        if (String(user.savedPins[i]) == String(allPins[j]._id)) {
          retPins.push(allPins[j]);
        }
      }
    }
    return retPins;
  },
  createComment: async function (pinId, commentText, userId) {
    if ((await checkMonooseObjectID([userId, pinId])) == 0) {
      return false;
    }
    let user = await userDocument.findById(userId);
    let pin = await this.getPinById(pinId);
    if (!user || !pin) return false;
    pin.comments.push({
      commenter: userId,
      comment: commentText,
      date: Date.now(),
      replies: [],
      likes: {
        counts: 0,
        likers: [],
      },
    });
    pin.counts.comments += 1;
    await pin.save();
    return true;
  },
  createReply: async function (pinId, replyText, userId, commentId) {
    if ((await checkMonooseObjectID([userId, pinId, commentId])) == 0) {
      return false;
    }
    let user = await userDocument.findById(userId);
    let pin = await this.getPinById(pinId);

    if (!user || !pin) return false;
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        pin.comments[i].replies.push({
          replier: userId,
          reply: replyText,
          date: Date.now(),
          likes: {
            counts: 0,
            likers: [],
          },
        });
        await pin.save();
        return true;
      }
    }
    return false;
  },
  getPinCommentsReplies: async function (pinId) {
    if ((await checkMonooseObjectID([pinId])) == 0) {
      return false;
    }
    let pin = await this.getPinById(pinId);
    if (!pin) return false;
    let retComments = [];
    for (var i = 0; i < pin.comments.length; i++) {
      let commenter = await userDocument.findById(pin.comments[i].commenter);
      if (commenter) {
        let comment = {
          commenter: pin.comments[i].commenter,
          commenterName: commenter.firstName + " " + commenter.lastName,
          commenterImage: commenter.profileImage,
          commentText: pin.comments[i].comment,
          date: pin.comments[i].date,
          likes: pin.comments[i].likes,
        };
        let replies = [];
        for (var j = 0; j < pin.comments[i].replies.length; j++) {
          let replier = await userDocument.findById(
            pin.comments[i].replies[j].replier
          );
          if (replier) {
            let reply = {
              replier: pin.comments[i].replies[j].replier,
              replierName: replier.firstName + " " + replier.lastName,
              replierImage: replier.profileImage,
              replyText: pin.comments[i].replies[j].reply,
              date: pin.comments[i].replies[j].date,
              likes: pin.comments[i].replies[j].likes,
            };
            replies.push(reply);
          }
        }
        retComments.push({ comment: comment, replies: replies });
      }
    }
    return retComments;
  },
  createReact: async function (pinId, reactType, userId) {
    if ((await checkMonooseObjectID([userId, pinId])) == 0) {
      return false;
    }
    if (
      String(reactType) != "Wow" &&
      String(reactType) != "Love" &&
      String(reactType) != "Good idea" &&
      String(reactType) != "Thanks" &&
      String(reactType) != "Haha"
    ) {
      return false;
    }
    let user = await userDocument.findById(userId);
    let pin = await this.getPinById(pinId);

    if (!user || !pin) return false;
    pin.reacts.push({
      reactType: reactType,
      userId: userId,
    });
    switch (reactType) {
      case "Wow":
        pin.counts.wowReacts += 1;
        break;
      case "Love":
        pin.counts.loveReacts += 1;
        break;
      case "Haha":
        pin.counts.hahaReacts += 1;
        break;
      case "Thanks":
        pin.counts.thanksReacts += 1;
        break;
      case "Good idea":
        pin.counts.goodIdeaReacts += 1;
        break;
    }
    await pin.save();
    return true;
  },
  likeComment: async function (pinId, commentId, userId) {
    if ((await checkMonooseObjectID([userId, pinId, commentId])) == 0) {
      return false;
    }
    let user = await userDocument.findById(userId);
    let pin = await this.getPinById(pinId);
    if (!user || !pin) return false;
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        pin.comments[i].likes.likers.push(userId);
        pin.comments[i].likes.counts += 1;
        await pin.save();
        return true;
      }
    }
    return false;
  },
  likeReply: async function (pinId, commentId, userId, replyId) {
    if (
      (await checkMonooseObjectID([userId, pinId, commentId, replyId])) == 0
    ) {
      return false;
    }
    let user = await userDocument.findById(userId);
    let pin = await this.getPinById(pinId);
    if (!user || !pin) return false;
    for (var i = 0; i < pin.comments.length; i++) {
      if (String(pin.comments[i]._id) == String(commentId)) {
        for (var j = 0; j < pin.comments[i].replies.length; j++) {
          if (String(pin.comments[i].replies[j]._id) == String(replyId)) {
            pin.comments[i].replies[j].likes.likers.push(userId);
            pin.comments[i].replies[j].likes.counts += 1;
            await pin.save();
            return true;
          }
        }
      }
    }
    return false;
  },
};

module.exports = Pin;
