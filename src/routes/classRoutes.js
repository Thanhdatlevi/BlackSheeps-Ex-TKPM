const express = require('express');
const router = express.Router();
const classController = require('../modules/class/classController');

router.get('/', classController.classPage);
router.post('/', classController.addClass);
router.put('/', classController.updateClass);

router.get('/classes', classController.getAllClasses);

router.get('/student', classController.addStudentClassPage);
router.post('/student', classController.addStudentToClass);
router.put('/student', classController.updateStudentInClass);

router.get('/courses', classController.getCourses);
router.get('/year', classController.getYear);
module.exports = router;
