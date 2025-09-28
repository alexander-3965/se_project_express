const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.js");
const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "68d8499c7e5b4c5cf071575d",
  };
  next();
});

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
