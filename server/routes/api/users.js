const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const passport = require("passport");

router.post("/singup", userController.user_signup);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    failureFlash: true
  }),
  function(req, res) {
    res.send(req.user);
  }
);
router.get("/", userController.index);
module.exports = router;
