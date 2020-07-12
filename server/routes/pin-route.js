const router = require("express").Router();
const auth = require("../middlewares/auth-middleware");
const Pin = require("../controllers/pin-controller");
const Image = require("../controllers/image-controller");
//create pin
router.post("/me/pins", auth, async (req, res) => {
  let imageId = req.body.imageId;
  let imageWidth = req.body.imageWidth;
  let imageHeight = req.body.imageHeight;
  let userId = req.user._id;
  let note = req.body.note;
  let title = req.body.title;
  let board = req.body.board;
  let link = req.body.link ? req.body.link : "";
  let createdPin = await Pin.createPin(
    userId,
    imageId,
    title,
    note,
    link,
    board,
    imageWidth,
    imageHeight
  );
  if (createdPin) {
    return res.status(200).send(createdPin);
  } else {
    await Image.deleteImage(imageId);
    return res.status(400).send("pin not created");
  }
});
//get all user created pins
router.get("/me/pins", auth, async (req, res) => {
  let userId = req.user._id;
  let pins = await Pin.getCurrentUserPins(userId);
  if (pins && pins.length != 0) {
    return res.status(200).send(pins);
  } else {
    return res.status(404).send("pins not found");
  }
});
//save pin
router.post("/me/savedPins/:id", auth, async (req, res) => {
  let pinId = req.params.id;
  let userId = req.user._id;
  let savedPin = await Pin.savePin(userId, pinId, boardId);
  if (savedPin) {
    return res.status(200).send("pin saved succissfully");
  } else {
    return res.status(400).send("pin not saved");
  }
});
//get all user saved pins
router.get("/me/savedPins", auth, async (req, res) => {
  let userId = req.user._id;
  let pins = await Pin.getCurrentUserSavedPins(userId);
  if (pins && pins.length != 0) {
    return res.status(200).send(pins);
  } else {
    return res.status(404).send("pins not found");
  }
});
//create comment
router.post("/pins/:pinId/comments", auth, async (req, res) => {
  let pinId = req.params.pinId;
  let commentText = req.body.commentText;
  let userId = req.user._id;
  let comment = await Pin.createComment(pinId, commentText, userId);
  if (comment) {
    return res.status(200).send({ success: true });
  } else {
    return res.status(400).send({ success: false });
  }
});
//create reply
router.post(
  "/pins/:pinId/comments/:commentId/replies",
  auth,
  async (req, res) => {
    let pinId = req.params.pinId;
    let commentId = req.params.commentId;
    let replyText = req.body.replyText;
    let userId = req.user._id;
    let reply = await Pin.createReply(pinId, replyText, userId, commentId);
    if (reply) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  }
);
//get pin comments replies
router.get("/pins/:pinId/comments", auth, async (req, res) => {
  let pinId = req.params.pinId;
  let comments = await Pin.getPinCommentsReplies(pinId);
  if (comments) {
    return res.status(200).send({ success: true, comments: comments });
  } else {
    return res.status(400).send({ success: false });
  }
});

//react pin with 5 types - like comment - like reply routes - controllers - socket
router.post("/pins/:pinId/reacts", auth, async (req, res) => {
  let pinId = req.params.pinId;
  let reactType = req.query.reactType;
  let userId = req.user._id;
  let react = await Pin.createReact(pinId, reactType, userId);
  if (react) {
    return res.status(200).send({ success: true });
  } else {
    return res.status(400).send({ success: false });
  }
});

router.post(
  "/pins/:pinId/comments/:commentId/likes",
  auth,
  async (req, res) => {
    let pinId = req.params.pinId;
    let commentId = req.params.commentId;
    let userId = req.user._id;
    let like = await Pin.likeComment(pinId, commentId, userId);
    if (like) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  }
);
router.post(
  "/pins/:pinId/comments/:commentId/replies/:replyId/likes",
  auth,
  async (req, res) => {
    let pinId = req.params.pinId;
    let commentId = req.params.commentId;
    let replyId = req.params.replyId;
    let userId = req.user._id;
    let like = await Pin.likeReply(pinId, commentId, userId, replyId);
    if (like) {
      return res.status(200).send({ success: true });
    } else {
      return res.status(400).send({ success: false });
    }
  }
);
module.exports = router;
