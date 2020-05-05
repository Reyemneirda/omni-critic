var express = require("express");
var path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const config = require("./config/db");

var app = express();

// this is our MongoDB database
const dbRoute = config.database;
console.log(dbRoute);
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
var articlesRoutes = require("./routes/api/articles");

app.use("/api/articles", articlesRoutes);
app.get("/", function(req, res) {
  res.send("Bizaare");
});
var port = process.env.PORT || 5000;
app.listen(port);

console.log("server started " + port);
