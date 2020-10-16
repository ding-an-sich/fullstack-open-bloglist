const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { body } = request

  if (!body.password || body.password.length < 6) {
    return response.status(400).json({ error: 'a password is required and must be at least 6 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })
  try {
    const savedUser = await user.save()
    return response.status(201).json(savedUser)
  } catch (exception) {
    return next(exception)
  }
})

module.exports = usersRouter
