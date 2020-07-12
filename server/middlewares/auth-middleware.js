const jwt = require("jsonwebtoken");
function auth(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Token must be provided");

  try {
    const decoded = jwt.verify(token, process.env.jwtsecret);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).send("Invalid Token");
  }
}

module.exports = auth;
