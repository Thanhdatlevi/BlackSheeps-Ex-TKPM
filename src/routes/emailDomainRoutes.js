const express = require ('express');
const router = express.Router();
const emailController = require('../modules/email/emailController');

router.get('/configEmailPage', emailController.configEmailPage);
router.post('/addEmail', emailController.addEmail);

router.get('/searchEmail', emailController.searchEmail);
router.put('/updateEmail', emailController.updateEmail);

router.get('/emails', emailController.getAllEmails);
router.delete('/deleteEmail', emailController.deleteEmail);

module.exports = router;