const router = require("express").Router();

const { RESOURCE_NOT_FOUND } = require("../utils/errors");

const { login, createUser } = require("../controllers/users");

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

router.post("/signup", createUser);

router.post("/signin", login);

router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(RESOURCE_NOT_FOUND).json({
    message: "Requested resource not found",
  });
});

module.exports = router;
