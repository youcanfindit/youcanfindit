const express = require("express");
const router = express.Router();
const Animal = require("../models/Animal");
const { ensureLoggedIn } = require("connect-ensure-login");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/animals/" });


router.get("/", (req, res, next) => {
  Animal.find()
    .populate("userId", "username")
    .exec((err, animals) => {
      if (err) {
        next(err);
        return;
      }

      console.log(animals);

      res.render("animals/list", { animals });
    });
});

router.get("/detail/:id", (req, res, next) => {
  console.log(req.params);
  Animal.findById(req.params.id)
    .populate("userId", "username")
    .exec((err, animal) => {
      if (err) {
        next(err);
        return;
      }

      console.log(animal);

      res.render("animals/detail", animal);
    });
});

router.get("/new", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("animals/new");
});


router.post("/new", [upload.single("profilePic"), ensureLoggedIn("/auth/login")], (req, res, next) => {
    const userId = req.user._id;
    console.log(userId);
    console.log(req.body)

    let { species, breed, name, color, gender, chip, state, description } = req.body;
    let profilePic = req.file.filename;
    const animalInfo = {
      species,
      breed,
      name,
      color,
      gender,
      chip,
      state,
      description,
      userId
    };

    if (profilePic) {
      animalInfo.profilePic = profilePic;
    }
    
    const newAnimal = new Animal(animalInfo);

    newAnimal.save(err => {
      if (err) {
        res.render("animal/new", {
          message: "Something went wrong. Try again later."
        });
        console.log(err);
        return;
      }

      res.redirect("/animal");
    });
  }
);

module.exports = router;
