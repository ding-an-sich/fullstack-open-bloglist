/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: { type: Number, default: 0 }
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
