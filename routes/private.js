const express = require("express");
const passport = require("passport");
const router = express.Router();
const Animal = require("../models/Animal");
const Post = require("../models/Post");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/users/" });
const { ensureLoggedIn } = require("connect-ensure-login");

router.get("/animals", ensureLoggedIn("/auth/login"), (req, res, next) => {
  console.log(req.user.id);
  Animal.find({ userId: req.user.id })
  .then(animals => {
    res.render("private/animals", { animals });
  });
});

/* router.get("/animals/edit:id", ensureLoggedIn("/auth/login"), (req, res, next) => {
    console.log(req.user.id);
    Animal.find({ userId: req.user.id })
    .then(animals => {
      res.render("private/animals", { animals });
    });
  }); */


router.get("/posts", ensureLoggedIn("/auth/login"), (req, res, next) => {
    Post.find({ userId: req.user.id })
    .then(posts => {
      res.render("private/posts", { posts });
    });
});

module.exports = router;