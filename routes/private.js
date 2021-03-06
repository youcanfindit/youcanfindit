//File with user private zone routes

const express = require("express");
const passport = require("passport");
const router = express.Router();
const Animal = require("../models/Animal");
const Post = require("../models/Post");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/animals/" });
const { ensureLoggedIn } = require("connect-ensure-login");
const roles = require("../utils/roles");

//Route that shows all the user animals
router.get("/animals", ensureLoggedIn("/auth/login"), (req, res, next) => {
  Animal.find({ userId: req.user.id })
  .then(animals => {
    res.render("private/animals", { animals, i18n: res });
  });
});

//Route that shows the animal editor view
router.get("/animals/editAnimal/:id", ensureLoggedIn("/auth/login"), (req, res, next) => {
    Animal.findById(req.params.id)
    .then(animal => {
      console.log(animal)
      res.render("private/editAnimal", { animal, i18n: res });
    });
});

//Route that edits an animal
router.post("/animals/editAnimal/:id", [upload.single("profilePic"), ensureLoggedIn("/auth/login")], (req, res, next) => {
    let id = req.params.id
    let { species, breed, name, color, gender, chip, state, description } = req.body;
    let animalInfo = {
      species,
      breed,
      name,
      color,
      gender,
      chip,
      state,
      description,
    };

    if(req.file) {
      let profilePic = req.file.filename;
      animalInfo.profilePic = profilePic
    }

    Animal.findByIdAndUpdate(req.params.id, {$set: animalInfo}, { new: true })
    .then(animal => {
      res.redirect("/private/animals");
    })
    .catch(error => {
      console.log(error);
    });
});

//Route that deletes an animal
router.get(('/animals/delete/:id'), ensureLoggedIn('auth/login'), (req, res, next) => {
  const userId = req.user._id
  const animalId = req.params.id

  Animal.findById(animalId)
  .exec((err, animal) => {
    if (roles.hasRole(req.user, 'admin') || roles.isOwner(req.user, animal.userId) || roles.isOwner(req.user, animal.userId)) {
      Animal.findByIdAndRemove(animalId).then(() => {
        res.redirect(`/private/animals`)
      })
    } else {
      res.redirect(`/private/animals`)
    }
  })
})

//Route that lists all the user posts
router.get("/posts", ensureLoggedIn("/auth/login"), (req, res, next) => {
    Post.find({ userId: req.user.id })
    .populate("animalId")
    .exec((err, posts) => {
      if (err) {
        next(err);
        return;
      }
      res.render("private/posts", { posts, i18n: res });
  })
});

//Route that shows the post editor view
router.get("/posts/editPost/:id", ensureLoggedIn("/auth/login"), (req, res, next) => {
  Post.findById(req.params.id)
  .populate('animalId')
  .then(post => {
    console.log(post)
    res.render("private/editPost", { post, i18n: res });
  });
});

//Route that edits a post
router.post("/posts/editPost/:id", [upload.single("profilePic"), ensureLoggedIn("/auth/login")], (req, res, next) => {
  console.log(req.params.id)
  let id = req.params.id
  let { animal, description, date, lat, lng, literal, reward } = req.body;
  let postInfo = {
    animal,
    description,
    date,
    location: {
      type: 'Point',
      coordinates: [lng, lat],
      literal
    },
    reward
  }

  if(req.file) {
    let profilePic = req.file.filename;
    animalInfo.profilePic = profilePic
  }

  Post.findByIdAndUpdate(req.params.id, {$set: postInfo}, { new: true })
  .then(animal => {
    res.redirect("/private/posts");
  })
  .catch(error => {
    console.log(error);
  });
});

//Route that deletes a post
router.get(('/posts/delete/:id'), ensureLoggedIn('auth/login'), (req, res, next) => {
  const userId = req.user._id
  const postId = req.params.id

  Post.findById(postId)
  .exec((err, post) => {
    console.log(post)
    if (roles.hasRole(req.user, 'admin') || roles.isOwner(req.user, post.userId) || roles.isOwner(req.user, postId.userId)) {
      Post.findByIdAndRemove(postId).then(() => {
        res.redirect(`/private/posts`)
      })
    } else {
      res.redirect(`/private/posts`)
    }
  })
})

//Route that closes a post (animal found)
router.get(('/posts/closePost/:id'), ensureLoggedIn('auth/login'), (req, res, next) => {
  const userId = req.user._id
  const postId = req.params.id

  let postInfo = {
    status: 'closed'
  }

  Post.findById(postId)
  .exec((err, post) => {
    if (roles.hasRole(req.user, 'admin') || roles.isOwner(req.user, post.userId)) {
      Post.findByIdAndUpdate(postId, {$set: postInfo}, { new: true }).then(() => {
        res.redirect(`/private/posts`)
      })
    } else {
      res.redirect(`/private/posts`)
    }
  })
})

module.exports = router;
