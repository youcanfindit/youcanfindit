const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const multer = require("multer");
// const upload = multer({ dest: "./public/uploads/users/" });
const ensureLogin = require("connect-ensure-login");
const uploadCloud = require("../config/cloudinary.js");
const urlencode = require('urlencode')
const { sendMail } = require('../mail/sendMail');


// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error"), i18n: res, active: 'login' });
});

authRoutes.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup", { i18n: res, active: 'signup' });
});

authRoutes.post("/signup", uploadCloud.single("profilePic"), (req, res, next) => {
  const { username, password, email, name } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" , i18n: res });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists", i18n: res });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const hashConfirmation = bcrypt.hashSync(username, salt)

    const newUser = new User({
      username,
      password: hashPass,
      email,
      name,
      profilePic: req.file.url,
      status: 'pending',
      confirmationCode: hashConfirmation
    });
    console.log(newUser);
    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong", i18n: res });
        return
      } else {
        let urlConfirmation = urlencode(hashConfirmation)

        let subject = 'Confirm your registration at Finderpet'
        if (res.locale === 'es') {
          subject = 'Confirma tu registro en Finderpet'
        }

        let welcome = 'Welcome to Finderpet'
        if (res.locale === 'es') {
          welcome = 'Bienvenido a Finderpet'
        }

        let claim = 'Please, use the button below to confirm your registration.'
        if (res.locale === 'es') {
          claim = 'Por favor, usa el boton de abajo para confirmar tu registro.'
        }

        let confirmationString = 'Validate your account'
        if (res.locale === 'es') {
          confirmationString = 'Valida tu cuenta'
        }

        sendMail(email, subject, {confirmationUrl: `${process.env.URL}auth/confirm/${urlConfirmation}`, welcome, claim, confirmationString}, 'confirmation').then( () => {
          console.log('mail enviado')
        })
        .catch(err => console.log('mail no enviado: ' + err))

        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

authRoutes.get("/profile", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/profile", { user: req.user, i18n: res, active: 'profile' });
});

authRoutes.get("/settings", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/settings", { user: req.user, i18n: res });
});

authRoutes.post(
  "/settings",
  [uploadCloud.single("profilePic"), ensureLogin.ensureLoggedIn()],
  (req, res) => {
    const { oldPassword, newPassword, email, profilePic } = req.body;
    const salt = bcrypt.genSaltSync(bcryptSalt);
    let update = {};

    if (req.body.email != "") {
      update.email = req.body.email;
    }

    if (req.body.oldPassword != "") {
      User.findById(req.user.id).then(user => {
        console.log(req.user.id);
        console.log(req.body.oldPassword);
        console.log(user.password);

        const hashPass = bcrypt.hashSync(newPassword, salt);
        if (bcrypt.compareSync(oldPassword, user.password)) {
          console.log("pass ok");
          password = hashPass;

          User.findByIdAndUpdate(
            req.user.id,
            { $set: { password } },
            { new: true }
          ).then(() => {
            if (res) {
              res.redirect("/auth/profile");
            } else {
              res.render("auth/settings", { message: "Something went wrong", i18n: res });
            }
          });
        } else {
          console.log("pass error");
        }
      });
    }

    if (req.file) {
      update.profilePic = req.file.filename;
    }

    console.log(update);
    User.findByIdAndUpdate(req.user.id, { $set: update }, { new: true }).then(
      () => {
        if (res) {
          res.redirect("/auth/profile");
        } else {
          res.render("auth/settings", { message: "Something went wrong", i18n: res });
        }
      }
    );
  }
);


authRoutes.get('/confirm/:id', (req, res, next) => {
  User.findOneAndUpdate({confirmationCode: urlencode.decode(req.params.id)}, {status: 'confirmed'})
  .then(() => {
    res.render('auth/confirm', {i18n: res, status: 'ok'})
  })
  .catch(() => {
    res.render('auth/confirm', {i18n: res, status: 'ko'})
  })
})

module.exports = authRoutes;
