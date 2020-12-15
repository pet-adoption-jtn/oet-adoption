const route = require('express').Router()
const UserController = require('../controllers/users');

route.post('/register', UserController.register);
route.post('/login', UserController.login);
route.post('/googlesignin', UserController.googleSignIn)

module.exports = route