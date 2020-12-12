const route = require('express').Router()
const PetController = require('../controllers/pets')
const Auth = require('../middlewares/auth')

route.get('/', PetController.readAll)
route.get('/:id', PetController.getOnePet)

route.use(Auth.authentication)
route.post('/', PetController.addPet)

route.use('/:id', Auth.authorization)
route.put('/:id', PetController.updatePet)
route.patch('/:id', PetController.adoptPet)
route.delete('/:id', PetController.deletePet)

module.exports = route