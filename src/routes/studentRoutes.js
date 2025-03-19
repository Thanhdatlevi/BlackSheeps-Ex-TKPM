const express = require('express');
const router = express.Router();
const studentController = require('../modules/student/studentController');
const addressController = require('../modules/address/addressController');
const identificationController = require('../modules/identification/identificationController');

router.get('/', studentController.addPage);
router.post('/add', studentController.addStudent);

router.get('/delete', studentController.deletePage);
router.delete('/delete-student', studentController.deleteStudent);

router.get('/search', studentController.searchPage);

router.get("/search-student", studentController.searchStudent);

router.get('/update', studentController.updateStudentPage);
router.get('/updateSearch', studentController.searchStudent);
router.put('/update', studentController.updateStudent);

router.post('/add-identification', identificationController.addIdentification);
router.post('/add-address', addressController.addAddress);

module.exports = router;
