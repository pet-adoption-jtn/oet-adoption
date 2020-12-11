module.exports = function error_handler (err, req, res, next) {
  let status = err.status || 500
  let message = err.message || 'Internal Server Error'
  if (err.name === 'MongoError') {
    status = 401
    message = 'Validation Error'
  }
  console.log(err);
  res.status(status).json({ message })
}