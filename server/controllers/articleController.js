var Article = require("../models/article");
var User = require("../models/user");

exports.index = function (req, res, next) {
  var query = {};
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  if (typeof req.query.tag !== "undefined") {
    query.tagList = { $in: [req.query.tag] };
  }

  Promise.all([
    req.query.author ? User.findOne({ username: req.query.username }) : null,
    req.query.favorited
      ? User.findOne({ username: req.query.favorited })
      : null,
  ])
    .then(function (results) {
      var author = results[0];
      var favoriter = results[1];

      if (author) {
        query.author = author._id;
      }

      if (favoriter) {
        query._id = { $in: favoriter.favorites };
      } else if (req.query.favorited) {
        query._id = { $in: [] };
      }

      return Promise.all([
        Article.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: "desc" })
          .populate("author")
          .exec(),
        Article.countDocuments(query).exec(),
        req.payload ? User.findById(req.payload.id) : null,
      ]).then(function (results) {
        var articles = results[0];
        var articlesCount = results[1];
        var user = results[2];

        return res.json({
          articles: articles.map(function (article) {
            return article.toJSONFor(user);
          }),
          articlesCount: articlesCount,
        });
      });
    })
    .catch(next);
};

exports.userFeed = function (req, res, next) {
  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }
  console.log(req.body);

  User.findById(req.query.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401);
    }

    Promise.all([
      Article.find({ author: { $in: user } })
        .limit(Number(limit))
        .skip(Number(offset))
        .populate("author")
        .exec(),
      Article.count({ author: { $in: user } }),
    ])
      .then(function (results) {
        var articles = results[0];
        var articlesCount = results[1];

        return res.json({
          articles: articles.map(function (article) {
            return article.toJSONFor(user);
          }),
          articlesCount: articlesCount,
        });
      })
      .catch(next);
  });
};
exports.create = function (req, res) {
  if (!req.user.role.includes("Admin") || !req.user.role.includes("Author")) {
    res.send({ status: 401, response: "Unautorized" });
  }
  params = {
    title: req.body.title,
    author: req.user_id,
    body: req.body.body,
    hidden: true,
  };
  Article.create(params, function (err, article) {
    if (err) {
      res.send(err);
    }
    res.send(article);
  });
};
