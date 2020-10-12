const listHelper = require('../utils/list_helper')
const blogs = require('./test_helper').initialBlogs

test('dummy returns one', () => {
  const result = listHelper.dummy()

  expect(result).toBe(1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    const emptyBlogList = []
    const result = listHelper.totalLikes(emptyBlogList)

    expect(result).toBe(0)
  })

  test('when having only one blog, equals the likes of that', () => {
    const listWithOneBlog = blogs.slice(0, 1)
    const result = listHelper.totalLikes(listWithOneBlog)

    expect(result).toBe(7)
  })

  test('of a list is the sum of all likes', () => {
    const result = listHelper.totalLikes(blogs)

    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    expect(result).toEqual({
      _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', likes: 12, __v: 0
    })
  })

  test('it works with only one blog', () => {
    const listWithOneBlog = blogs.slice(0, 1)
    const result = listHelper.favoriteBlog(listWithOneBlog)

    expect(result).toEqual({
      _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7, __v: 0
    })
  })

  test('it returns 0 when no blogs are present', () => {
    const emptyBlogList = []
    const result = listHelper.favoriteBlog(emptyBlogList)

    expect(result).toBe(0)
  })
})

describe('most prolific author', () => {
  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('it works with only one blog/author', () => {
    const listWithOneBlog = blogs.slice(0, 1)
    const result = listHelper.mostBlogs(listWithOneBlog)

    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('it returns 0 when no blogs are present', () => {
    const emptyBlogList = []
    const result = listHelper.mostBlogs(emptyBlogList)

    expect(result).toBe(0)
  })
})

describe('most voted author', () => {
  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('works with only one blog/author', () => {
    const listWithOneBlog = blogs.slice(0, 1)
    const result = listHelper.mostLikes(listWithOneBlog)

    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('it returns 0 when no blogs are present', () => {
    const emptyBlogList = []
    const result = listHelper.mostLikes(emptyBlogList)

    expect(result).toBe(0)
  })
})
