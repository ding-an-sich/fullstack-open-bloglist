const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { initialBlogs } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promises = blogObjects.map((blogObject) => blogObject.save())
  await Promise.all(promises)
})

/* Alternative version with for..of loop
 * Slower but executes each save in order
 * (not parallelized)

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})
*/

describe('when listing blogs', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all the blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('unique identifiers are returned as \'id\'', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })
})

describe('when adding a blog', () => {
  test('a blog can be added', async () => {
    const newBlog = {
      title: 'I have nothing interesting to say',
      author: 'vmrc',
      url: 'www.piadinhasinfames.com.br',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('a blog added without likes will default to 0', async () => {
    const newBlog = {
      title: 'I have nothing interesting to say',
      author: 'vmrc',
      url: 'www.piadinhasinfames.com.br',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)

    const response = await api.get('/api/blogs')
    expect(response.body[initialBlogs.length].likes).toBe(0)
  })

  test('a blog added without title and/or url will not be added', async () => {
    const newBlog = {
      author: 'vmrc',
      likes: 42
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('when deleting a blog', () => {
  test('sending a correct id deletes the corresponding blog', async () => {
    let response = await api.get('/api/blogs')

    await api
      .delete(`/api/blogs/${response.body[0].id}`)
      .expect(204)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length - 1)
  })

  test('sending an incorrect id returns an exception', async () => {
    await api
      .delete('/api/blogs/banana')
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
