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
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      role: ["User"],
      bio: req.body.bio,
      image: req.body.imagePath
    }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      passport.authenticate("local")(req, res, function() {
        res.send({ status: 200, response: req.user });
      });
    }
  );
};
