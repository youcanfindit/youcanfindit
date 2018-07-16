const express = require('express');
const router  = express.Router();
const Animal = require('../models/Animal')
const {ensureLoggedIn} = require('connect-ensure-login');

router.get('/', (req, res, next) => {
    Animal.find()
    .populate('User', 'username')
    .exec((err, animals) => {
      if (err) {
        next(err)
        return
      }
  
      console.log(animals)
  
      res.render('animals/list', {animals})
    })
  })


module.exports = router;