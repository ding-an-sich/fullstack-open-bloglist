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

module.exports = {
  palindrome,
  average,
  dummy,
  totalLikes
}
