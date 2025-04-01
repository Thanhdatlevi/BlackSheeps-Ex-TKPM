const express = require('express');
const router = express.Router();
const classController = require('../modules/class/classController');

router.get('/class', classController.classPage);
router.put('/class', classController.updateClass);
router.post('/class', classController.addClass);


router.get('/class/student', classController.addStudentClassPage);
router.post('/class/student', classController.addStudentToClass);
router.put('/class/student', classController.updateStudentInClass);

module.exports = router;
