//Cloudinary config file

require("dotenv").config();

const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

//Acces credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

//Storage folder config
let storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "finderpet",
  allowedFormats: ["jpg", "png"],
  filename: function(req, file, cb) {
    photo = new Date().getTime();
    cb(undefined, photo);
  }
});

//Multer config
const uploadCloud = multer({ storage: storage })
module.exports = uploadCloud;
