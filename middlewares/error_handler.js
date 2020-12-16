function error_handler (err, req, res, next) {
  let status = err.status || 500
  let message = err.message || 'Internal Server Error'
  
  if (err.name === 'MongoError') {
    status = 401
    message = 'Validation Error'
  }
  res.status(status).json({ message })
}

module.exports = error_handler