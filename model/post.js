const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    desc: {
      type: String,
    },
    photo: {
      type: String,
    },
    video: {
      type: String,
    },
    username: {
      type: String,
    },
    categories: {
      type: Array,
      require: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Post", PostSchema);
