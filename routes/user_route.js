const route = require('express').Router()
const UserController = require('../controllers/users');
const Auth = require('../middlewares/auth')

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.post('/googlesignin', UserController.googleSignIn);
route.post('/edituser', Auth.authentication ,UserController.editUser)

module.exports = route