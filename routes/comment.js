const express = require('express')
const router  = express.Router()
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const {ensureLoggedIn} = require('connect-ensure-login')
const roles = require("../utils/roles");


router.get('/new/:id', ensureLoggedIn('auth/login'), (req, res, next) => {
  console.log(req.params.id)
  const postId = req.params.id
  Post.findById(postId)
  .then(post => {
    res.render('comment/new', {post: post})
  })
  .catch()
})

router.post('/new/:id', ensureLoggedIn('auth/login'), (req, res, next) => {
  const userId = req.user._id
  const postId = req.params.id

  let {comment} = req.body

  let commentInfo = {
    userId,
    postId,
    comment,
    stars: [0, 0]
  }

  let newComment = new Comment(commentInfo)

  newComment.save((err) => {
    if (err) {
      res.render('comment/new', {
        message: 'Something went wrong. Try again later.'
      })
      console.log(err)
      return
    }

    res.redirect(`/post/detail/${req.params.id}`)
  })
})

router.get(('/delete/:id'), ensureLoggedIn('auth/login'), (req, res, next) => {
  const userId = req.user._id
  const commentId = req.params.id
  let postId

  Comment.findById(commentId)
  .populate('postId', 'userId')
  .exec((err, comment) => {
    if (roles.hasRole(req.user, 'admin') || roles.isOwner(req.user, comment.userId) || roles.isOwner(req.user, comment.postId.userId)) {
      postId = comment.postId._id
      Comment.findByIdAndRemove(commentId).then(() => {
        res.redirect(`/post/detail/${postId}`)
      })
    } else {
      res.redirect(`/post/detail/${postId}`)
    }
  })
})

module.exports = router
