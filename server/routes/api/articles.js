const express = require("express");
const router = express.Router();
// const articleController = require("../../controllers/articleController");

router.get("/", function(req, res) {
  res.send("hello");
});

module.exports = router;
