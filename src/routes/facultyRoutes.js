const express = require('express');
const router = express.Router();
const facultyController = require('../modules/faculty/facultyController');

router.get('/addFacultyPage', facultyController.addPage);
router.post('/addFaculty', facultyController.addFaculty);

router.get('/updateFacultyPage', facultyController.updatePage);
router.get('/searchFacultyByName', facultyController.searchFacultyByName);
router.post('/updateFaculty', facultyController.updateFaculty);

router.get('/faculties', facultyController.getAllFaculties);
module.exports = router;