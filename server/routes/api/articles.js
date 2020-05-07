const express = require("express");
const router = express.Router();
const articleController = require("../../controllers/articleController");

router.get("/", articleController.index);

router.post("/create", articleController.create);
module.exports = router;
