const express = require('express');
const router = express.Router();
const studentController = require('../modules/student/studentController');

router.get('/', studentController.addPage);
router.post('/add', studentController.addStudent);

router.get('/delete', studentController.deleteStudent);

router.get('/search', studentController.searchPage);

router.get("/search-student", studentController.searchStudent);

router.get('/update', studentController.updateStudentPage);
router.get('/update/:mssv', studentController.updateQueryStudent);
router.put('/update', studentController.updateStudent);

module.exports = router;
