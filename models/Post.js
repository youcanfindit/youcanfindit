const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const postSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, ref: 'User'},
  animalId: {type: Schema.Types.ObjectId, ref: 'Animal'},
  date: {type: String, required: true},
  description: {type: String, required: true},
  location: {
      type: {type: String},
      coordinates: [Number],
      literal: {type: String}
  },
  reward: {type: String}
})

//Establecemos un indice de ordenación por ubicacion
postSchema.index({location: '2dsphere'})
//Añadimos timestamps
postSchema.set('timestamps', true)

const Post = mongoose.model('Post', postSchema)
module.exports = Post
