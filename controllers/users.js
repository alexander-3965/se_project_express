const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {
  GOOD_REQUEST_STATUS_CODE,
  CREATED_REQUEST_STATUS_CODE,
} = require("../utils/successStatuses");

const {
  SERVER_ISSUE,
  BAD_REQUEST_STATUS_CODE,
  RESOURCE_NOT_FOUND,
  CONFLICT_ERROR,
  INVALID_CREDENTIALS,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      if (err.message === "Missing password or email") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      res.status(INVALID_CREDENTIALS).send({ message: err.message });
    });
};

module.exports.getCurrentUser = (req, res) => {
  console.log("getting user");
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(GOOD_REQUEST_STATUS_CODE).send(user))
    .catch((err) => {
      console.log(err);

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      return res.status(SERVER_ISSUE).send({
        message: "An error has occured on the server.",
      });
    });
};

module.exports.createUser = (req, res) => {
  console.log(" signup route hit");
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObject = user.toObject();
      const { password, ...userWithoutPassword } = userObject;
      res.status(CREATED_REQUEST_STATUS_CODE).send(userWithoutPassword);
    })
    .catch((err) => {
      console.log(err.name);
      console.error(err);
      if (err.name === "MongoServerError") {
        return res.status(CONFLICT_ERROR).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res.status(SERVER_ISSUE).send({
        message: "An error has occured on the server.",
      });
    });
};

module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  const updates = { name, avatar };
  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.status(GOOD_REQUEST_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res.status(SERVER_ISSUE).send({
        message: "An error has occured on the server.",
      });
    });
};
