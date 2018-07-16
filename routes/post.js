const express = require('express')
const router  = express.Router()

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('post/list')
})

router.get('/detail?:id', (req, res, next) => {
  res.render('post/detail')
})

router.get('/new', (req, res, next) => {
  res.render('post/new')
})

router.post('/new', (req, res, next) => {
  res.render('post/list')
})

module.exports = router
