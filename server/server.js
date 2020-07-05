require("dotenv/config"); // to use env variable

const express = require("express");
const methodOverride = require("method-override");
const cors = require("cors");
const bodyparser = require("body-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");

const connection = require("./controllers/db-controller");
const pins = require("./routes/pin-route");
const authantication = require("./routes/authentication-route");
const user = require("./routes/user-route");
var images = require("./routes/image-route");
var boards = require("./routes/board-route");

const app = express();
//connect to database
connection(app);

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(logger("dev"));

app.use(session({ secret: "anything" }));
app.use(passport.initialize());
app.use(methodOverride());

app.use("/api", pins);
app.use("/api", authantication);
app.use("/api", user);
app.use("/api", images);
app.use("/api", boards);

const API_PORT = process.env.PORT || 3000;

app.use(function (error, req, res, next) {
  res.status(500);
  res.send({ error: error.message });
});
var server = app.listen(process.env.port || API_PORT, function () {
  console.log("listening for a request");
});
require("./controllers/socket-controller")(server);

module.exports = app;
