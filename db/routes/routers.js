const TagsRoute = require('./tagsRoute')
const ProgramRoute = require('./programRoute')
const Router = require('express')
const router = new Router();
const studentController = require('../controllers/studentController');
const projectRoute = require('./projectRoute')
const userRoute = require('./userRoute')
const roleVerify = require('./../middleware/role')

router.use('/tags', TagsRoute)
router.use('/program', ProgramRoute)
router.use('/group', studentController.getGroups)
router.use('/year', studentController.getYears)
router.use('/student', studentController.getStudent)
router.use('/allstudents', studentController.getAllStudents)
router.post('/student-create', studentController.createStudent)
router.post('/student-update', studentController.updateStudent)
router.post('/student-skills', studentController.updateStudentsSkills)
router.use('/project', projectRoute)
router.use('/user', userRoute)

module.exports = router;