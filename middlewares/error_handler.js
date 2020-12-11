module.exports = function error_handler (err, req, res, next) {
  console.log(err)
  let status = err.status || 500
  let message = err.message || 'Internal Server Error'
  if (err.name === 'MongoError') {
    status = 401
    message = 'Validation Error'
  } else if (err.name === undefined) {
    status = err.status
    message = err.message  
  }
  res.status(status).json({ message })
}