const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

var ArticleSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  body: String,
  comments: [{ body: String, date: Date }],
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
  slug: String,
  description: String,
  tagList: [{ type: mongoose.Schema.ObjectId, ref: "Category" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  favorited: Boolean,
  favoritesCount: Number,
});
ArticleSchema.post("save", function (doc) {
  updatedAt = Date.now;
  slug = title.toLowerCase().replace(name.replace(/\s/g, "-"));
});
module.exports = mongoose.model("Article", ArticleSchema);
