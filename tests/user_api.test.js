const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { mockUsers } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('when listing users', () => {
  test('initially returns an empty list', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
    expect(response.body.length).toBe(0)
  })

  test('when populated, returns a list with added users', async () => {
    const userObjects = mockUsers.map((user) => new User(user))
    const promises = userObjects.map((userObject) => userObject.save())
    await Promise.all(promises)

    const response = await api
      .get('/api/users')
      .expect(200)
    expect(response.body.length).toBe(2)
  })
})

describe('when creating a user', () => {
  test('passing the correct information returns a 201 response', async () => {
    const newUser = { name: 'Vinicius', username: 'vmrc', password: '123456' }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('the created user has a field called \'id\'', async () => {
    const newUser = { name: 'Vinicius', username: 'vmrc', password: '123456' }
    const response = await api
      .post('/api/users')
      .send(newUser)
    const savedUser = response.body
    expect(savedUser.id).toBeDefined()
  })

  test('the created user can be found in the database', async () => {
    const newUser = { name: 'Vinicius', username: 'vmrc', password: '123456' }
    await api
      .post('/api/users')
      .send(newUser)
    const createdUser = await User.findOne({ name: 'Vinicius' })
    expect(createdUser.username).toBe('vmrc')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
