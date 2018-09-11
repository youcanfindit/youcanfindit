//Passport serializer file

const passport = require('passport');
const User = require('../models/User');

//Function that erializes an user
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

//Function that deserializes an user
passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, userDocument);
  });
});
