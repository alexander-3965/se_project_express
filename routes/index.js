const router = require("express").Router();

const userRouter = require("./users");

const ItemRouter = require("./clothingItems");

router.use("/users", userRouter);

router.use("/items", ItemRouter);

module.exports = router;
