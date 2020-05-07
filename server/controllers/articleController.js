var Article = require("../models/article");

exports.index = function(req, res) {
  if (!req.user.role.includes("Admin")) {
    res.send({ status: 401, response: "Unautorized" });
  }
  Article.find({}, function(err, articles) {
    if (err) {
      res.send(err);
    } else {
      res.send({ status: 200, response: articles });
    }
  });
};

exports.create = function(req, res) {
  if (!req.user.role.includes("Admin") || !req.user.role.includes("Author")) {
    res.send({ status: 401, response: "Unautorized" });
  }
  params = {
    title: req.body.title,
    author: req.user_id,
    body: req.body.body,
    hidden: true
  };
  Article.create(params, function(err, article) {
    if (err) {
      res.send(err);
    }
    res.send(article);
  });
};
