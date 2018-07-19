const dotenv = require("dotenv");
dotenv.config({path: './.env'});
dotenv.config({path: './.env.private'});

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");

mongoose.Promise = Promise;
mongoose
  .connect(process.env.DBURL, {useMongoClient: true})
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

var i18n = require('i18n');

i18n.configure({
//define how many languages we would support in our application
locales:['en', 'es'],
//define the path to language json files, default is /locales
directory: __dirname + '/locales',
//define the default language
defaultLocale: 'en',
// define a custom cookie name to parse locale settings from
cookie: 'i18n'
});

app.use(cookieParser("i18n_demo"));


// Enable authentication using session + passport
app.use(
  session({
    secret: "i18n_demo",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());


require("./passport")(app);

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "locals")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

app.use(i18n.init);

hbs.registerHelper("ifUndefined", (value, options) => {
  if (arguments.length < 2)
    throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

hbs.registerHelper('if_equal', function(a, b, opts) {
    if ((a + '') == (b + '')) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
})

hbs.registerHelper('__', function () {
  console.log("hola")
  return i18n.__.apply(this, arguments);
});
hbs.registerHelper('__n', function () {
  console.log("adios")
  return i18n.__n.apply(this, arguments);
});


// default value for title local
app.use((req, res, next) => {
  app.locals.title = "You can find it";
  app.locals.user = req.user;
  console.log(req.user ? req.user.username : 'no user')
  next();
});

const index = require("./routes/index");
app.use("/", index);

const postRoutes = require('./routes/post')
app.use('/post', postRoutes)

const commentRoutes = require('./routes/comment')
app.use('/comment', commentRoutes)

const animalRoutes = require('./routes/animal')
app.use('/animal', animalRoutes)

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const privateRoutes = require("./routes/private");
app.use("/private", privateRoutes);

module.exports = app;
