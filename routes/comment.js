//Comment routes file

const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { ensureLoggedIn } = require("connect-ensure-login");
const roles = require("../utils/roles");
const { sendMail } = require('../mail/sendMail');

//New comment vew route
router.get("/new/:id", ensureLoggedIn("/auth/login"), (req, res, next) => {
  const postId = req.params.id;
  Post.findById(postId)
    .then(post => {
      res.render("comment/new", { post: post, i18n: res, active: 'posts' });
    })
    .catch();
});

//New comment post route
router.post("/new/:id", ensureLoggedIn("/auth/login"), (req, res, next) => {
  const userId = req.user._id;
  const postId = req.params.id;

  let { comment } = req.body;

  let commentInfo = {
    userId,
    postId,
    comment,
    stars: [0, 0]
  };

  let newComment = new Comment(commentInfo);

  newComment.save((err) => {
    if (err) {
      res.render("comment/new", {
        message: "Something went wrong. Try again later."
      });
      return;
    } else {
      Post.findById(req.params.id)
      .populate('userId')
      .exec((err, post) => {
        let subject = 'You have recived a new comment on Finderpet'
        if (res.locale === 'es') {
          subject = 'Has recibido un nuevo comentario en Finderpet'
        }

        let welcome = 'You have a new comment'
        if (res.locale === 'es') {
          welcome = 'Tienes un nuevo comentario'
        }

        let claim = 'Read it using the button below.'
        if (res.locale === 'es') {
          claim = 'Leelo pulsando el boton de abajo'
        }

        let confirmationString = 'Read comment'
        if (res.locale === 'es') {
          confirmationString = 'Leer comentario'
        }

        sendMail(post.userId.email, subject, {confirmationUrl: `${process.env.URL}post/detail/${req.params.id}`, welcome, claim, confirmationString}, 'comment').then( () => {
          console.log('mail de comentario enviado')
        })
        .catch(err => console.log('mail de comentario no enviado: ' + err))
      })

      res.redirect(`/post/detail/${req.params.id}`);
    }
  })
})

//Edit comment view route
router.get("/edit/:id", ensureLoggedIn("/auth/login"), (req, res, next) => {
  Comment.findById(req.params.id).then(post => {
    res.render(`comment/edit`, { post, i18n: res, active: 'posts' });
  });
});

//Edit comment post route
router.post("/edit/:id", ensureLoggedIn("/auth/login"), (req, res, next) => {
  let { comment } = req.body;

  Comment.findByIdAndUpdate(req.params.id, { $set: { comment } }, { new: true })
    .then(comment => {
      res.redirect(`/post/detail/${comment.postId}`);
    })
    .catch(error => {});
});

//Delete comment route
router.get("/delete/:id", ensureLoggedIn("auth/login"), (req, res, next) => {
  const userId = req.user._id;
  const commentId = req.params.id;
  let postId;

  Comment.findById(commentId)
    .populate("postId", "userId")
    .exec((err, comment) => {
      if (
        roles.hasRole(req.user, "admin") ||
        roles.isOwner(req.user, comment.userId) ||
        roles.isOwner(req.user, comment.postId.userId)
      ) {
        postId = comment.postId._id;
        Comment.findByIdAndRemove(commentId).then(() => {
          res.redirect(`/post/detail/${postId}`);
        });
      } else {
        res.redirect(`/post/detail/${postId}`);
      }
    });
});

module.exports = router;
