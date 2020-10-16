const logger = require('./logger')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    switch (error.kind) {
      case 'ObjectId':
        return response.status(400).send({ error: 'malformatted id' })
      case 'Number':
        return response.status(400).send({ error: 'must be a number!' })
      default:
        return response.status(500).send({ error: 'unexpected error' })
    }
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }

  return next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  return next()
}

module.exports = {
  errorHandler,
  tokenExtractor
}
