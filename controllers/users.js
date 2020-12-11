const { db } = require('../config/mongo');
const users = db.collection('Users');
const { compare, hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

class UserController {
  static async register(req, res, next) {
    try {
      const { username, email, password, address, phone } =  req.body

      if (username === null || email === null || password === null || address === null || phone === null) {
        throw ({ status: 400, message: 'Please fill all the columns' })
      } else if (password.length < 6) {
        throw ({status: 400, message: 'Password minimum is six characters'})
      } else if (username.length < 6) {
        throw ({ status: 400, message: 'Minimum username is six characters'})
      } else if (phone.length < 11 && phone !== '') {
        throw ({ status: 400, message: 'Phone must have minimum eleven characters' })
      } else if (email === '' || address === '' || phone === '') {
        throw ({ status: 400, message: 'Please fill all the columns' })
      } else {
        const response = await users.insertOne({
          username,
          email,
          password: hashPassword(password),
          address,
          phone
        })
        res.status(201).json({
          email: response.ops[0].email,
          _id: response.ops[0]._id,
          username: response.ops[0].username
        })
      }
    } catch (error) {
      next(error)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      const payload = {
        email,
        password
      }
      const findUser = await users.findOne({ email: payload.email })

      if (!findUser) {
        throw ({ status: 401, message: 'Invalid email/password' })
      } else if (!compare(payload.password, findUser.password)) {
        throw ({ status: 401, message: 'Invalid email/password' })
      } else {
        const access_token = signToken({
          _id: findUser._id,
          username: findUser.username,
          email: findUser.email
        })

        res.status(200).json({
          access_token: access_token
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController;