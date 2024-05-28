const Router = require('express');
const userController = require('../controllers/userController');
const router = new Router(); 
const auth = require('./../middleware/auth')

router.get('/', userController.getUser)
router.post('/reg', userController.registration)
router.post('/login', userController.login)
router.get('/check', auth, userController.check)

module.exports = router