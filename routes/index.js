const router = require("express").Router();

const { RESOURCE_NOT_FOUND } = require("../utils/errors");

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(RESOURCE_NOT_FOUND).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
