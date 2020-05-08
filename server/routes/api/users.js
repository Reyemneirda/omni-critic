const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const passport = require("passport");

router.post("/singup", userController.user_signup);
//
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureRedirect: "/",
//     failureFlash: true
//   }),
//   function(req, res) {
//     res.send(req.user);
//   }
// );
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, "Cannot log in here", info]);
    }

    req.login(user, err => {
      res.send(user);
    });
  })(req, res, next);
});

router.get("/", userController.index);
module.exports = router;
