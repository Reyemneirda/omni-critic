const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

var ArticleSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

module.exports = mongoose.model("Article", ArticleSchema);
