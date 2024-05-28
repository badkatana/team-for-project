const Router = require('express')
const router = new Router(); 
const projectController = require('../controllers/projectController');

router.post('/create', projectController.createProject)
router.get('/all', projectController.getAllProjects)
router.get('/')

module.exports = router