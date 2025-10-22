const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getCurrentUser, updateUser } = require("../controllers/users");

router.use("/", auth);

router.patch("/me", updateUser);

router.get("/me", getCurrentUser);

module.exports = router;
