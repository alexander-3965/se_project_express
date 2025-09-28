const clothingItem = require("../models/clothingItem.js");

const {
  GOOD_REQUEST_STATUS_CODE,
  CREATED_REQUEST_STATUS_CODE,
  SERVER_ISSUE,
  BAD_REQUEST_STATUS_CODE,
  RESOURCE_NOT_FOUND,
} = require("../utils/errors.js");

module.exports.getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .orFail()
    .then((clothes) => res.status(GOOD_REQUEST_STATUS_CODE).send(clothes))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      res.status(SERVER_ISSUE).send({ message: err.message });
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, imageUrl, weather, owner })
    .then((item) =>
      res.status(CREATED_REQUEST_STATUS_CODE).send({ data: item })
    )
    .catch((err) => {
      console.log(err.name);
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      res.status(SERVER_ISSUE).send({
        message: err.message,
      });
    });
};

module.exports.likeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((like) => {
      res.status(GOOD_REQUEST_STATUS_CODE).send({ data: like });
    })
    .catch((err) => {
      console.log(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      res.status(SERVER_ISSUE).send({
        message: err.message,
      });
    });

module.exports.dislikeItem = (req, res) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((like) => {
      res.status(GOOD_REQUEST_STATUS_CODE).send({ data: like });
    })
    .catch((err) => {
      console.log(err.name);
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      res.status(SERVER_ISSUE).send({
        message: err.message,
      });
    });

module.exports.deleteClothingItem = (req, res) =>
  clothingItem
    .findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => {
      res.status(GOOD_REQUEST_STATUS_CODE).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      res.status(SERVER_ISSUE).send(err.message);
    });
