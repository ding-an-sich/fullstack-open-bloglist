/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true, minlength: 3
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})
userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    const transformedObject = { ...returnedObject }
    transformedObject.id = returnedObject._id.toString()
    delete transformedObject._id
    delete transformedObject.__v
    delete transformedObject.passwordHash
    return transformedObject
  }
})

module.exports = mongoose.model('User', userSchema)
