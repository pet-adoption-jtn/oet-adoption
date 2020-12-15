const { db } = require('../config/mongo');
const { compare, hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');
const { OAuth2Client } = require('google-auth-library');

const users = db.collection('Users');

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
        const unique = await users.findOne({ email: email})
        if (unique) {
          throw ({ status: 400, message: 'Email is already exists' })
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
          access_token: access_token,
          account: findUser
        })
      }
    } catch (error) {
      next(error)
    }
  }

  static async googleSignIn(req, res, next) {
    try {
      const client = new OAuth2Client('281372448495-9egpusn6t7nq49euno6bv5ffi9qesq2s.apps.googleusercontent.com');
      const { googleToken } = req.body
      const tiket = await client.verifyIdToken({
        idToken: googleToken,
        audience: '281372448495-9egpusn6t7nq49euno6bv5ffi9qesq2s.apps.googleusercontent.com'
      })
      const payload = tiket.getPayload()
      const userGoogle = await users.findOne({
        email: payload.email
      })
      if(userGoogle) {
        const access_token = signToken({
          _id: userGoogle._id,
          username: userGoogle.username,
          email: userGoogle.email
        })

        res.status(200).json({
          access_token: access_token,
          account: userGoogle
        })
      } else {
        const { ops } = await users.insertOne({
          email: payload.email,
          username: payload.name,
          password: hashPassword('usergoogle'),
          address: '-',
          phone: '-'
        })
        
        const access_token = signToken({
          _id: ops[0]._id,
          username: ops[0].username,
          email: ops[0].email
        })

        res.status(200).json({
          access_token: access_token,
          account: ops[0]
        })
      }
      
      console.log(tiket.getPayload())
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController;