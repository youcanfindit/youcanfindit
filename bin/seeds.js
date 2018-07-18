require("dotenv").config();
const mongoose  = require('mongoose')
const bcrypt = require('bcrypt')
const bcryptSalt = 10;
const User = require('../models/User')

mongoose.connect(process.env.DBURL, {useMongoClient: true})

const salt = bcrypt.genSaltSync(bcryptSalt);

let users = [
  {
    username: 'Juan',
    password: bcrypt.hashSync("123456", salt),
    name: 'Juan Castro',
    email: 'juan@gmail.com',
    role: 'admin'
  },
  {
    username: 'Pepe',
    password: bcrypt.hashSync("123456", salt),
    name: 'Pepe Pepper',
    email: 'pepe@gmail.com',
    role: 'user'
  },
  {
    username: 'Marc',
    password: bcrypt.hashSync("123456", salt),
    name: 'Marc Pomar',
    email: 'marc@gmail.com',
    role: 'user'
  }
]

User.collection.drop()

User.create(users, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close()
})
