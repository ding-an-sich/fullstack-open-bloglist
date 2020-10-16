/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const { body } = request
  let decodedToken = null

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (exception) {
    next(exception)
    // Not sure if this is the best way of handling this error
    return null
  }

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  return response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response, next) => {
  let blog = null

  try {
    blog = await Blog.findById(request.params.id)
  } catch (exception) {
    next(exception)
    return null
  }

  if (blog === null) {
    return response.status(404).json({ error: 'not found' })
  }

  let decodedToken = null

  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (exception) {
    next(exception)
    return null
  }

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (blog.user.toString() === decodedToken.id) {
    await blog.delete()
    return response.status(204).end()
  }

  return response.status(401).json({ error: 'action not authorized' })
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { body } = request
  const blog = {
    likes: body.likes
  }
  try {
    const uptadedBlog = await Blog.findByIdAndUpdate(
      request.params.id, blog,
      { new: true, runValidators: true }
    )
    response.json(uptadedBlog)
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
