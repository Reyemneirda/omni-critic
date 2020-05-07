const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true
    },
    role: Array,
    bio: String,
    image: String,
    hash: String,
    salt: String
  },
  { collection: "users", timestamps: true }
);
UserSchema.plugin(uniqueValidator, { message: "is already taken." });
UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

UserSchema.statics.isValidUserPassword = function(username, password, done) {
  var criteria =
    username.indexOf("@") === -1 ? { username: username } : { email: username };
  this.findOne(criteria, "+salt +hash", function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: "Incorrect username." });
    var hash = crypto
      .pbkdf2Sync(password, user.salt, 10000, 512, "sha512")
      .toString("hex");
    if (err) return done(err);
    delete user.salt;

    if (hash == user.hash) {
      delete user.hash;
      console.log("before return");

      return done(null, user);
    }
    console.log("Shit");
    return done(null, false, {
      message: "Incorrect password"
    });
  });
};

module.exports = mongoose.model("User", UserSchema);
