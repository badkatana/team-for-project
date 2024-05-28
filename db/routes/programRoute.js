const Router = require('express')
const router = new Router(); 
const ProgramController = require('../controllers/programsController')

router.get('/', ProgramController.getAll)

module.exports = router