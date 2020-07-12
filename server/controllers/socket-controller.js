var socket = require("socket.io");
const userModel = require("../models/db").user;
const pinModel = require("../models/db").pin;
module.exports = function (server) {
  var io = socket(server);
  io.on("connection", function (socket) {
    socket.on("setUserId", async function (data) {
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.jwtsecret);
      userId = decoded._id;
      let user = await userModel.findById(userId);
      if (user) {
        user.socketId = socket.id;
        await user.save();
      }
    });
    socket.on("comment", async function (data) {
      let commentText = data.commentText;
      let pinId = data.pinId;
      let pin = await pinModel.findById(pinId);
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.jwtsecret);
      commenterId = decoded._id;
      let commenter = await userModel.findById(commenterId);
      if (commenter && pin && commentText) {
        io.sockets.emit("sendComment", {
          commentText: data.text,
          commenterName: commenter.firstName + " " + commenter.lastName,
          commenterImage: commenter.profileImage,
          pinId: data.pinId,
          date: Date.now(),
        });
      }
    });
    socket.on("reply", async function (data) {
      let replyText = data.replyText;
      let pinId = data.pinId;
      let commentId = data.commentId;
      let pin = await pinModel.findById(pinId);
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.jwtsecret);
      replierId = decoded._id;
      let replier = await userModel.findById(replierId);
      if (replier && pin && replyText) {
        io.sockets.emit("sendReply", {
          replyText: replyText,
          replierName: replier.firstName + " " + replier.lastName,
          replierImage: replier.profileImage,
          pinId: data.pinId,
          commentId: commentId,
          date: Date.now(),
        });
      }
    });
    socket.on("reactPin", async function (data) {
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.jwtsecret);
      userId = decoded._id;
      let user = await userModel.findById(userId);
      let pin = await pinModel.findById(data.pinId);
      io.sockets.emit("sendPinReact", {
        reactType: data.reactType,
        userName: user.firstName + " " + user.lastName,
        userImage: user.profileImage,
        pinId: data.pinId,
        wowReacts: pin.counts.wowReacts,
        loveReacts: pin.counts.loveReacts,
        goodIdeaReacts: pin.counts.goodIdeaReacts,
        hahaReacts: pin.counts.hahaReacts,
        thanksReacts: pin.counts.thanksReacts,
      });
    });
    socket.on("likeComment", async function (data) {
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.jwtsecret);
      userId = decoded._id;
      let user = await userModel.findById(userId);
      let pin = await pinModel.findById(data.pinId);
      for (var i = 0; i < pin.comments.length; i++) {
        if (String(pin.comments[i]._id) == String(data.commentId)) {
          io.sockets.emit("sendLikeComment", {
            userName: user.firstName + " " + user.lastName,
            userImage: user.profileImage,
            pinId: data.pinId,
            commentId: pin.comments[i]._id,
            commentLikes: pin.comments[i].likes.counts,
          });
          break;
        }
      }
    });
    socket.on("likeReply", async function (data) {
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.jwtsecret);
      userId = decoded._id;
      let user = await userModel.findById(userId);
      let pin = await pinModel.findById(data.pinId);
      for (var i = 0; i < pin.comments.length; i++) {
        if (String(pin.comments[i]._id) == String(data.commentId)) {
          for (var j = 0; j < pin.comments[i].replies.length; j++) {
            if (
              String(pin.comments[i].replies[j]._id) == String(data.replyId)
            ) {
              io.sockets.emit("sendLikeReply", {
                userName: user.firstName + " " + user.lastName,
                userImage: user.profileImage,
                pinId: data.pinId,
                commentId: pin.comments[i]._id,
                replyId: data.replyId,
                replyLikes: pin.comments[i].replies[j].likes.counts,
              });
              break;
            }
          }

          break;
        }
      }
    });
    socket.on("clearUserId", async function (data) {
      const token = data.token;
      const decoded = await jwt.verify(token, process.env.jwtsecret);
      userId = decoded._id;
      let user = await userModel.findById(userId);
      if (user) {
        user.socketId = "none";
        await user.save();
      }
    });
  });
  //
};
