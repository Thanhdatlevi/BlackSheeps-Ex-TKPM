const express = require('express');
const router = express.Router();
const programController = require('../modules/program/programController');

router.get('/addProgramPage', programController.addPage);
router.post('/addProgram', programController.addProgram);

router.get('/updateProgramPage', programController.updatePage);
router.get('/searchProgramByName', programController.searchProgramByName);
router.post('/updateProgram', programController.updateProgram);

router.get('/programs', programController.getAllPrograms);
module.exports = router;