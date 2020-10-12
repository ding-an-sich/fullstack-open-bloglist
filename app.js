const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')

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
