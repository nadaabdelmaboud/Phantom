var socket = require("socket.io");
const userModel = require("../models/db").user;
module.exports = function (server) {
  var io = socket(server);
  io.on("connection", function (socket) {
    socket.on("setUserId", async function (data) {
      let user = await userModel.findById(data.userId);
      if (user) {
        user.socketId = socket.id;
        await user.save();
      }
    });
    socket.on("comment", async function (data) {
      let user = await userModel.findById(data.userId);
      const token = data.token;
      const decoded = jwt.verify(token, process.env.jwtsecret);
      commentterId = decoded._id;
      let commentter = await userModel.findById(commentterId);
      if (user && commentter) {
        let socketId = user.socketId;
        if (socketId && socketId != "none") {
          console.log(socketId);
          socket.broadcast.to(socketId).emit("sendComment", {
            commentText: data.text,
            commentterName: commentter.firstName + " " + commentter.lastName,
            commentterImage: commentter.profileImage,
            pinId: data.pinId,
            date: Date.now(),
          });
        }
      }
    });
    socket.on("clearUserId", async function (data) {
      const token = data.token;
      const decoded = jwt.verify(token, process.env.jwtsecret);
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
