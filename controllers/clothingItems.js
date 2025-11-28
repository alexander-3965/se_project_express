const clothingItem = require("../models/clothingItem");

const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");

const {
  GOOD_REQUEST_STATUS_CODE,
  CREATED_REQUEST_STATUS_CODE,
} = require("../utils/successStatuses");

module.exports.getClothingItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((clothes) => res.status(GOOD_REQUEST_STATUS_CODE).send(clothes))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("No clothing items found"));
      }
      next(err);
    });
};

module.exports.createClothingItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, imageUrl, weather, owner })
    .then((item) =>
      res.status(CREATED_REQUEST_STATUS_CODE).send({ data: item })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid clothing item data"));
      }
      next(err);
    });
};

module.exports.likeItem = (req, res, next) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .then((like) => {
      if (!like) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(GOOD_REQUEST_STATUS_CODE).send({ data: like });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      }
      next(err);
    });

module.exports.dislikeItem = (req, res, next) =>
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .then((like) => {
      if (!like) {
        return next(new NotFoundError("Item not found"));
      }
      return res.status(GOOD_REQUEST_STATUS_CODE).send({ data: like });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      }
      next(err);
    });

module.exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)

    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found"));
      }
      if (item.owner.toString() !== req.user._id) {
        return next(new ForbiddenError("You can only delete your own items"));
      }

      return clothingItem
        .findByIdAndDelete(itemId)
        .then((deletedItem) =>
          res.status(GOOD_REQUEST_STATUS_CODE).send(deletedItem)
        )
        .catch((err) => {
          console.error(err);
          next(err);
        });
    })

    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid item ID"));
      }
      next(err);
    });
};
