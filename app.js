const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const mainRouter = require("./routes/index");

const auth = require("./middlewares/auth");

const { login, createUser } = require("./controllers/users");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());

app.use(cors());

app.post("/signup", createUser);

app.post("/signin", login);

app.use("/users", auth);

app.use("/items", auth);

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
