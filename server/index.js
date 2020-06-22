var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const passport = require("passport");

require("./utils/passport");

const config = require("./config/db");
const User = require("./models/user");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
var flash = require("connect-flash");

var app = express();

// this is our MongoDB database
var port = process.env.PORT || 5000;

if (port == 5000) {
  var dbRoute = config.database_test;
} else {
  var dbRoute = config.database;
}
// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

var articlesRoutes = require("./routes/api/articles");
var usersRoutes = require("./routes/api/users");
var authRoutes = require("./routes/api/auth");

app.use(flash());
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use(
  "/api/articles",
  passport.authenticate("jwt", { session: false }),
  articlesRoutes
);

app.get("/", function(req, res) {
  res.send(req.flash());
});

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

app.listen(port);

console.log("server started " + port);
