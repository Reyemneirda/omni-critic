const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const secret = require("../../config/jwt").secret;

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
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }

    if (!user) {
      return res.status(400).send([user, "Cannot log in here", info]);
    }
    req.login(user, { session: false }, err => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user.toJSON(), secret);
      return res.json({ user, token });
    });
  })(req, res);
  //   req.login(user, err => {
  //     res.send(user);
  //   });
  // })(req, res, next);
});

module.exports = router;
