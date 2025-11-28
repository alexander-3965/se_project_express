const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  validateItemId,
  validateItemBody,
} = require("../middlewares/validation");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);

router.use("/", auth);

router.post("/", validateItemBody, createClothingItem);

router.delete("/:itemId", validateItemId, deleteClothingItem);

router.put("/:itemId/likes", validateItemId, likeItem);

router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
