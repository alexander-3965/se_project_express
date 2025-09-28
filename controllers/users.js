const User = require("../models/user");

const {
  GOOD_REQUEST_STATUS_CODE,
  CREATED_REQUEST_STATUS_CODE,
  SERVER_ISSUE,
  BAD_REQUEST_STATUS_CODE,
  RESOURCE_NOT_FOUND,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(GOOD_REQUEST_STATUS_CODE).send(users))
    .catch((err) => {
      console.log(err);
      res
        .status(SERVER_ISSUE)
        .send({ message: "An error has occured on the server." });
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((users) => res.status(GOOD_REQUEST_STATUS_CODE).send(users))
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
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED_REQUEST_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
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
