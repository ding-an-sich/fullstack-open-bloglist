const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')

mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
