/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0, min: [0, 'likes must be at least 0'] },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const transformedObject = { ...returnedObject }
    transformedObject.id = transformedObject._id.toString()
    delete transformedObject._id
    delete transformedObject.__v
    return transformedObject
  }
})

module.exports = mongoose.model('Blog', blogSchema)
