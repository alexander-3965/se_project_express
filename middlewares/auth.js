const { JWT_SECRET } = require("../utils/config");
const { INVALID_CREDENTIALS } = require("../utils/errors");

const jwt = require("jsonwebtoken");

const handleAuthError = (res) => {
  res.status(INVALID_CREDENTIALS).send({ message: "Authorization Error" });
};

module.exports = (req, res, next) => {
  console.log("using auth");
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  next();
};
