const express = require('express');
const router = express.Router();
const courseController = require('../modules/course/courseController');

router.get('/addCoursePage', courseController.addCoursePage);
router.post('/addCourse', courseController.addCouse);

router.get('/searchCourseById', courseController.searchCourseById);

router.get('/getAllCourses', courseController.getAllCourses);
router.delete('/deleteCourse', courseController.deleteCourse);

router.put('/updateCourse', courseController.updateCourse);
router.put('/updateCourseStatus', courseController.updateCourseStatus);

router.get('/editCoursePage', courseController.editCoursePage);

router.get('/isCourseNameExists', courseController.isCourseExistInClass);
module.exports = router;