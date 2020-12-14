const route = require('express').Router()
const PetController = require('../controllers/pets')
const Auth = require('../middlewares/auth')

route.get('/', PetController.readAll)
route.get('/detail/:id', PetController.getOnePet)
route.get('/filter/:type', PetController.filterType)

route.use(Auth.authentication)
route.get('/owner', PetController.getPetByOwner)
route.post('/', PetController.addPet)
route.post('/request_adoption', PetController.requestAdoption)

route.use('/:id', Auth.authorization)
route.put('/:id', PetController.updatePet)
route.patch('/:id', PetController.adoptPet)
route.delete('/:id', PetController.deletePet)

module.exports = route