const Router = require('express')
const router = new Router(); 
const TagsController = require('../controllers/tagsController')

router.get('/', TagsController.getAll)
router.get('/popular', TagsController.getSixPopular)
router.post('/create', TagsController.createTag)

module.exports = router