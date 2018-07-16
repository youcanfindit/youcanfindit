const express = require('express')
const router  = express.Router()
const Post = require('../models/Post')
const {ensureLoggedIn} = require('connect-ensure-login');

/* GET home page */
router.get('/', (req, res, next) => {
  Post.find()
  .populate('User', 'username')
  .populate('Animal', 'name')
  .exec((err, posts) => {
    if (err) {
      next(err)
      return
    }

    console.log(posts)

    res.render('post/list', {posts})
  })
})

router.get('/detail?:id', (req, res, next) => {
  res.render('post/detail')
})

router.get('/new', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('post/new')
})

router.post('/new', ensureLoggedIn('/auth/login'), (req, res, next) => {
  res.render('post/list')
})

module.exports = router
