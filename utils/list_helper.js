const _ = require('lodash')

const palindrome = (string) => string
  .split('')
  .reverse()
  .join('')

const average = (array) => {
  const reducer = (sum, item) => sum + item

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}

const dummy = () => 1

const totalLikes = (blogs) => {
  const reducer = (sumOfLikes, item) => sumOfLikes + item.likes

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (blogA, blogB) => (blogA.likes > blogB.likes ? blogA : blogB)

  return blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
  const authorList = _.countBy(blogs, 'author')
  const reducer = (keyA, keyB) => (authorList[keyA] > authorList[keyB] ? keyA : keyB)
  const mostProlificAuthor = Object.keys(authorList).reduce(reducer, 0)

  if (mostProlificAuthor === 0) {
    return mostProlificAuthor
  }
  return { author: mostProlificAuthor, blogs: authorList[mostProlificAuthor] }
}

const mostLikes = (blogs) => {
  const authorList = _.groupBy(blogs, 'author')
  const authorsAndVotes = []

  Object.keys(authorList).forEach((author) => {
    let likes = 0
    authorList[author].forEach((blog) => {
      likes += blog.likes
    })

    const authorObject = {}

    authorObject.author = author
    authorObject.likes = likes
    authorsAndVotes.push(authorObject)
  })
  const mostVotedAuthor = _.maxBy(authorsAndVotes, 'likes')
  if (mostVotedAuthor) {
    return mostVotedAuthor
  }

  return 0
}

module.exports = {
  palindrome,
  average,
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
