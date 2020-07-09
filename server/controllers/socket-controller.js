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
      commentterId = decoded._id;
      let commentter = await userModel.findById(commentterId);
      if (commentter && pin && commentText) {
        io.sockets.emit("sendComment", {
          commentText: data.text,
          commentterName: commentter.firstName + " " + commentter.lastName,
          commentterImage: commentter.profileImage,
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
