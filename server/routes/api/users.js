const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const passport = require("passport");

router.get("/", userController.index);
router.post("/singup", userController.user_signup);
router.post("/login", passport.authenticate("local"), function(req, res) {
  res.send(req.user);
});
module.exports = router;
