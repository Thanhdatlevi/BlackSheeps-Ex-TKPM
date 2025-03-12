const express = require('express');
const router = express.Router();
const studentController = require('../modules/student/studentController');


router.get('/', studentController.addStudent);

router.get('/delete', studentController.deleteStudent);

router.get('/search', studentController.searchStudent);

module.exports = router;