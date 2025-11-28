const router = require("express").Router();

const auth = require("../middlewares/auth");

const { validateUserUpdate } = require("../middlewares/validation");

const { getCurrentUser, updateUser } = require("../controllers/users");

router.use("/", auth);

router.patch("/me", validateUserUpdate, updateUser);

router.get("/me", getCurrentUser);

module.exports = router;
