const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, mockUsers } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const rootUser = {
    username: 'root',
    name: 'SuperMan',
    password: 'admin123'
  }

  await api
    .post('/api/users')
    .send(rootUser)

  const blogObjects = initialBlogs.map((blog) => new Blog(blog))
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

// These users won't get hashed passwords
const populateWithUsers = async (users) => {
  const userObjects = users.map((user) => new User(user))
  const promises = userObjects.map((userObject) => userObject.save())
  await Promise.all(promises)
}

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
    await populateWithUsers(mockUsers)

    const loginInfo = {
      username: 'root',
      password: 'admin123'
    }

    let response = await api
      .post('/api/login')
      .send(loginInfo)

    const newBlog = {
      title: 'I have nothing interesting to say',
      author: 'vmrc',
      url: 'www.piadinhasinfames.com.br',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${response.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)
  })

  test('a blog added without likes will default to 0', async () => {
    await populateWithUsers(mockUsers)

    const loginInfo = {
      username: 'root',
      password: 'admin123'
    }

    let response = await api
      .post('/api/login')
      .send(loginInfo)

    const newBlog = {
      title: 'I have nothing interesting to say',
      author: 'vmrc',
      url: 'www.piadinhasinfames.com.br',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${response.body.token}`)
      .send(newBlog)

    response = await api.get('/api/blogs')
    expect(response.body[initialBlogs.length].likes).toBe(0)
  })

  test('a blog added without title and/or url will not be added', async () => {
    const loginInfo = {
      username: 'root',
      password: 'admin123'
    }

    let response = await api
      .post('/api/login')
      .send(loginInfo)

    const newBlog = {
      author: 'vmrc',
      likes: 42
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${response.body.token}`)
      .send(newBlog)
      .expect(400)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('when deleting a blog', () => {
  test('sending a correct id deletes the corresponding blog', async () => {
    // Creating the blog

    const loginInfo = {
      username: 'root',
      password: 'admin123'
    }

    let response = await api
      .post('/api/login')
      .send(loginInfo)

    const { token } = response.body

    const newBlog = {
      title: 'Will delete',
      author: 'root',
      url: 'www.willdelete.com',
      likes: 100
    }

    response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)

    const { id } = response.body

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('sending an incorrect id returns an exception', async () => {
    await api
      .delete('/api/blogs/banana')
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
})

describe('when updating a blog', () => {
  test('sending a new likes number updates the corresponding blog likes', async () => {
    const newLikes = { likes: 45 }
    let response = await api.get('/api/blogs')

    await api
      .put(`/api/blogs/${response.body[0].id}`)
      .send(newLikes)
      .expect(200)

    response = await api.get('/api/blogs')
    const updatedBlog = response.body[0]
    expect(updatedBlog.likes).toBe(45)
  })

  test('sending malformatted likes returns an exception', async () => {
    const newLikes = { likes: 'banana' }
    let response = await api.get('/api/blogs')

    await api
      .put(`/api/blogs/${response.body[0].id}`)
      .send(newLikes)
      .expect(400)

    response = await api.get('/api/blogs')
    const updatedBlog = response.body[0]
    expect(updatedBlog.likes).not.toBe('banana')
  })

  test('sending negative values as likes returns an exception', async () => {
    const newLikes = { likes: -30 }
    let response = await api.get('/api/blogs')

    await api
      .put(`/api/blogs/${response.body[0].id}`)
      .send(newLikes)
      .expect(400)

    response = await api.get('/api/blogs')
    const updatedBlog = response.body[0]
    expect(updatedBlog.likes).not.toBe(-30)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
