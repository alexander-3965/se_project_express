const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const {
  GOOD_REQUEST_STATUS_CODE,
  CREATED_REQUEST_STATUS_CODE,
} = require("../utils/successStatuses");

const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");
const ConflictError = require("../errors/conflict-error");

const { JWT_SECRET } = require("../utils/config");

module.exports.login = (req, res, next) => {
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
      console.error(err);
      if (err.message === "Missing password or email") {
        next(new BadRequestError("Missing password or email"));
      } else {
        next(new UnauthorizedError("Incorrect password or email"));
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => res.status(GOOD_REQUEST_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const { password: _pw, ...userWithoutPassword } = user.toObject();
      res.status(CREATED_REQUEST_STATUS_CODE).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        next(new ConflictError("Email already in use"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  const updates = { name, avatar };
  User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true })
    .then((user) => res.status(GOOD_REQUEST_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid user data"));
      }
      next(err);
    });
};
