const { db } = require('../config/mongo');

const users = db.collection('Users');

class UserController {
  static async register(req, res) {
    try {
      const newUser = {
        email: req.body.email,
        password: req.body.password
      }
      if (newUser.password.length < 6) {
        res.status(400).json({
          message: 'Minimum password is six characters'
        })
      } else if (newUser.email === '') {
        res.status(400).json({
          message: 'Please fill all the columns'
        })
      } else {
        const response = await users.insertOne(newUser)
        res.status(201).json({
          email: response.ops[0].email,
          _id: response.ops[0]._id
        })
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }

  static async login() {

  }
}

module.exports = UserController;