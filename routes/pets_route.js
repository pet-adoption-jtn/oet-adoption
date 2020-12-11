const route = require('express').Router()
const PetController = require('../controllers/pets')
const Auth = require('../middlewares/auth')

route.get('/', PetController.readAll)

route.use(Auth.authentication)
route.get('/:id', PetController.getOnePet)
route.post('/', PetController.addPet)

route.use('/:id', Auth.authorization)
route.put('/:id', PetController.updatePet)
route.delete('/:id', PetController.deletePet)

module.exports = route