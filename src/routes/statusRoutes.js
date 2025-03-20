const express = require('express');
const router = express.Router();
const statusController = require('../modules/status/statusController');

router.get('/addStatusPage', statusController.addPage);
router.post('/addStatus', statusController.addStatus);

router.get('/updateStatusPage', statusController.updatePage);
router.get('/searchStatusByName', statusController.searchStatusByName);
router.post('/updateStatus', statusController.updateStatus);

router.get('/statuses', statusController.getAllStatus);

module.exports = router;