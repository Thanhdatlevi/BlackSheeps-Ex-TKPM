const express = require('express');
const router = express.Router();
const gradeController = require('../modules/grade/gradeController');

router.get('/gradePage', gradeController.gradePage);
router.get('/searchGrade', gradeController.searchGrade);
router.get('/exportGrades', gradeController.exportStudentGrades);
module.exports = router;