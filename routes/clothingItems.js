const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems.js");
// const { users } = require();

router.get("/", getClothingItems);

router.post("/", createClothingItem);

router.delete("/:itemId", deleteClothingItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

router.use((req, res) => {
  if (res.statusCode === 404) {
    res.status(404).json({
      message: "Requested resource not found",
    });
  }
});

module.exports = router;
