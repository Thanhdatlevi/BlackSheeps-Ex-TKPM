const express = require('express');
const router = express.Router();
const studentController = require('../modules/student/studentController');

router.get('/', studentController.addPage);
router.post('/add', studentController.addStudent);

router.get('/delete', studentController.deletePage);
router.delete('/delete-student', studentController.deleteStudent);

router.get('/search', studentController.searchPage);

router.get("/search-student", studentController.searchStudent);

router.get('/update', studentController.updateStudentPage);
router.get('/updateSearch', studentController.searchStudent);
router.get('/updateSearchID', studentController.searchStudentIdentification);
router.put('/update', studentController.updateStudent);

module.exports = router;
