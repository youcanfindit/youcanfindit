//Post model file

const mongoose = require('mongoose')
const Schema   = mongoose.Schema

//Post schema
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
  reward: {type: String},
  status: {type: String, required: true, enum: ['open', 'closed']}
})

//Establecemos un indice de ordenación por ubicacion
postSchema.index({location: '2dsphere'})
//Añadimos timestamps
postSchema.set('timestamps', true)

const Post = mongoose.model('Post', postSchema)
module.exports = Post
