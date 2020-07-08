const express = require("express");
const router = express.Router();
const articleController = require("../../controllers/articleController");

const passport = require("passport");

router.get("/", articleController.index);
router.get(
  "/user-feed",
  passport.authenticate("jwt", { session: false }),
  articleController.userFeed
);

router.post("/create", articleController.create);
module.exports = router;
