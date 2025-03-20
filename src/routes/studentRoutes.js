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
router.put('/update', studentController.updateStudent);

router.get('/export/csv', studentController.exportStudentListCSV)
router.get('/export/csv/identification', studentController.exportIdentificationDocumentsCSV)

router.get('/export/excel', studentController.exportStudentListExcel)
router.get('/export/excel/identification', studentController.exportIdentificationDocumentsExcel)

router.post("/import/csv", studentController.importCSV);
router.post("/import/excel", studentController.importExcel);

module.exports = router;
