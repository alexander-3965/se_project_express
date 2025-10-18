const clothingItem = require("../models/clothingItem");

const {
  GOOD_REQUEST_STATUS_CODE,
  CREATED_REQUEST_STATUS_CODE,
} = require("../utils/successStatuses");

const {
  SERVER_ISSUE,
  BAD_REQUEST_STATUS_CODE,
  RESOURCE_NOT_FOUND,
  FORBIDDEN_STATUS_CODE,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  clothingItem
    .find({})
    .then((clothes) => res.status(GOOD_REQUEST_STATUS_CODE).send(clothes))
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(SERVER_ISSUE)
        .send({ message: "An error has occured on the server." });
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
      console.log(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ISSUE)
        .send({ message: "An error has occured on the server." });
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
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ISSUE)
        .send({ message: "An error has occured on the server." });
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
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(RESOURCE_NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(SERVER_ISSUE)
        .send({ message: "An error has occured on the server." });
    });

module.exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()

    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN_STATUS_CODE)
          .send({ message: "You can only delete your own items" });
      }
      return clothingItem
        .findByIdAndDelete(itemId)
        .then((deletedItem) =>
          res.status(GOOD_REQUEST_STATUS_CODE).send(deletedItem)
        )
        .catch((err) => {
          console.log(err);
          throw new Error("Deletion error");
        });
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
      return res
        .status(SERVER_ISSUE)
        .send({ message: "An error has occured on the server." });
    });
};
