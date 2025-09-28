const mongoose = require("mongoose");

const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    minlength: 2,
    maxlength: 30,
    type: String,
    required: true,
  },
  weather: {
    required: true,
    type: String,
    enum: ["hot", "cold", "warm"],
  },
  imageUrl: {
    required: true,
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("item", clothingItemSchema);
