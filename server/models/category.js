const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

var CategorySchema = new Schema({
  name: { type: String },
  articles: [{ type: mongoose.Schema.ObjectId, ref: "Article" }],
});
module.exports = mongoose.model("Category", CategorySchema);
