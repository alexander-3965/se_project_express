const router = require("express").Router();

const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

const NotFoundError = require("../errors/not-found-error");

const { login, createUser } = require("../controllers/users");

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

router.post("/signup", validateUserBody, createUser);

router.post("/signin", validateAuthentication, login);

router.use("/users", userRouter);

router.use("/items", itemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
