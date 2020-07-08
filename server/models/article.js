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
ArticleSchema.pre("validate", function (next) {
  if (!this.slug) {
    this.slugify();
  }

  next();
});

ArticleSchema.methods.slugify = function () {
  this.slug =
    slug(this.title) +
    "-" +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
};
ArticleSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    title: this.title,
    description: this.description,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user),
  };
};
module.exports = mongoose.model("Article", ArticleSchema);
