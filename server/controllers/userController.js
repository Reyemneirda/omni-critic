var User = require("../models/user");
const passport = require("passport");

exports.index = function(req, res) {
  console.log(req.user);
  console.log(req.session);

  if (!req.user.role.includes("Admin")) {
    res.send({ status: 401, response: "Unautorized" });
  }
  User.find({}, function(err, users) {
    if (err) {
      res.send(err);
    } else {
      console.log(users);
      res.send({ status: 200, response: users });
    }
  });
};
exports.user_signup = function(req, res) {
  // console.log("sending stuff");
  // var username = req.body.username;
  // var password = req.body.password;
  // var newUser = new User();
  // newUser.username = username;
  // newUser.setPassword(password);
  // console.log("Before stuff");
  //
  // newUser.save((err, savedUser) => {
  //   console.log(savedUser);
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.redirect("/");
  //   }
  // });
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      role: ["User"],
      bio: req.body.bio
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      passport.authenticate("local")(req, res, function() {
        console.log(req);

        res.send({ status: 200, response: req.user });
      });
    }
  );
};
