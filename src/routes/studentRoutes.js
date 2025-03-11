const express = require('express');
const router = express.Router();
const studentController = require('../modules/student/studentController');


router.get('/', studentController.addStudent);

module.exports = router;