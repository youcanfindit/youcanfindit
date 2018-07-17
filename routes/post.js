const express = require('express')
const router  = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const Animal = require('../models/Animal')
const {ensureLoggedIn} = require('connect-ensure-login')

/* GET home page */
router.get("/", (req, res, next) => {
  Post.find()
    .populate("userId", "username")
    .populate("animalId")
    .exec((err, posts) => {
      if (err) {
        next(err);
        return;
      }
      console.log(posts)
    res.render('post/list', {posts})
  })
})

router.get('/detail/:id', (req, res, next) => {
  Post.findById(req.params.id)
  .populate('userId', 'username')
  .populate('animalId', 'name')
  .exec((err, post) => {
    if (err) {
      next(err)
      return
    }

    Comment.find({postId: post._id})
    .populate('userId', 'username')
    .sort({created_at: -1})
    .exec((err, comments) => {
      res.render('post/detail', {post, comments})
    })
  })

});

router.get('/new', ensureLoggedIn('/auth/login'), (req, res, next) => {
  Animal.find({userId: req.user._id})
  .exec((err, animals) => {
    if (err) {
      next(err);
      return;
    }

    if (animals.length == 0) {
      res.render('post/new', {noAnimals: 'No tienes mascotas, crea una nueva'})
      return
    }

    res.render('post/new', {animals})
  })
})

router.post("/new", ensureLoggedIn("/auth/login"), (req, res, next) => {
  const userId = req.user._id;
  console.log(userId);
  const animalId = req.body.animal;
  console.log(animalId);

  let { description, date, lat, lng } = req.body;

  Post.findOne({ animalId: animalId }, (err, foundPost) => {
    if (err) {
      next(err);
      return;
    }

    if (foundPost !== null) {
      res.render("post/new", {
        message: "Ya existe un anuncio con esta mascota"
      });
      return;
    }

    const postInfo = {
      userId,
      animalId,
      state: "lost",
      date,
      description,
      location: {type: 'Point', coordinates: [lat, lng]}
    }

    const newPost = new Post(postInfo)

    newPost.save(err => {
      if (err) {
        res.render("post/new", {
          message: "Something went wrong. Try again later."
        });
        console.log(err);
        return;
      }

      res.redirect("/post");
    });
  });
});

module.exports = router;
