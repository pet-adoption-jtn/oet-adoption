const { db } = require('../config/mongo')
const { ObjectID } = require('mongodb')
const { verifyToken } = require('../helpers/jwt')

const users = db.collection('Users')
const pets = db.collection('Pets')

class Auth {
  static async authentication (req, res, next) {
    try {
      const { access_token } = req.headers
      if (!access_token) {
        throw { status: 401, message: 'Authentication Failed' }
      } else {
        const decode = verifyToken(access_token)
        const user = await users.findOne({
          email: decode.email
        })
        if (!user) {
          throw { status: 401, message: 'Authentication Failed' }
        } else {
          req.userLoggedIn = decode
          next()
        }
      }
    } catch (error) {
      next(error)
    }
  }

  static async authorization (req, res, next) {
    try {
      const id = req.params.id
      const user_id = req.userLoggedIn._id
      const pet = await pets.findOne({
        _id: ObjectID(id)
      })
      if (!pet) {
        throw { status: 404, message: 'Pet is not found' }
      } else if (pet.user_id !== user_id) {
        throw { status: 401, message: 'Not Authorized' }
      } else {
        next()
      }
    } catch (error) {
      next(error)
    }
  }
}


module.exports = Auth