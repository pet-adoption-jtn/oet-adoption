const route = require('express').Router()
const FavController = require('../controllers/favorite')
const Auth = require('../middlewares/auth')

route.use(Auth.authentication)
route.post('/', FavController.postFavorite)
route.get('/', FavController.getAllFavorite)
route.delete('/:id', FavController.deleteFavPet)

module.exports = route