const express = require('express');
const router = express.Router();
const studentController = require('../modules/student/studentController');


router.get('/', studentController.addStudent);

// update student
router.get('/update', studentController.updateStudentPage);
router.get('/update/:mssv', studentController.updateQueryStudent);
router.put('/update', studentController.updateStudent);

module.exports = router;
