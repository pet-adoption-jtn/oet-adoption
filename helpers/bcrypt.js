const bcrypt = require('bcryptjs')

function hashPassword (pass) {
  const hashed = bcrypt.hashSync(pass, 10)
  return hashed
}

function compare (pass, hash) {
  const res = bcrypt.compareSync(pass, hash)
  return res
}

module.exports = {
  hashPassword,
  compare
}