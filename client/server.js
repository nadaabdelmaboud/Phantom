const express = require("express");
const serveStatic = require("serve-static");
const path = require("path");
var history = require("connect-history-api-fallback");

app = express();
app.use(history());
app.use(serveStatic(path.join(__dirname, "dist")));
app.get("/", function(req, res) {
  res.render(path.join(__dirname + "/dist/index.html"));
});
const port = process.env.PORT || 80;
app.listen(port);
