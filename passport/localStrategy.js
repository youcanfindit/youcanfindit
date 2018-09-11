//Passport local strategies file

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');

//Function that validates login info
passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, { message: 'Incorrect username' });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password' });
      return;
    }

    if (foundUser.status.toLowerCase() !== 'confirmed') {
      next(null, false, { message: 'Mail not validated' })
      return
    }

    next(null, foundUser);
  });
}));
