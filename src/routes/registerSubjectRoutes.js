const express = require('express');
const router = express.Router();
const registrationController = require('../modules/registration/registrationController');

router.get('/deleteRegistrationPage', registrationController.deleteRegistrationPage);
router.get('/searchdeleteRegistration', registrationController.searchdeleteRegistration);
router.delete('/deleteRegistration', registrationController.deleteRegistration);
module.exports = router;