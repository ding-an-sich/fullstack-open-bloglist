/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String
})

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
