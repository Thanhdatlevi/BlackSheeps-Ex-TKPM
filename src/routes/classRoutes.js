const express = require('express');
const router = express.Router();
const classController = require('../modules/class/classController');

router.get('/class', classController.classPage);
router.post('/class', classController.addClass);
router.put('/class', classController.updateClass);

router.get('/classes', classController.getAllClasses);

router.get('/class/student', classController.addStudentClassPage);
router.post('/class/student', classController.addStudentToClass);
router.put('/class/student', classController.updateStudentInClass);

router.get('/class/courses', classController.getCourses);
router.get('/class/year', classController.getYear);
module.exports = router;
