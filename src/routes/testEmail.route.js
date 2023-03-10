const express = require('express');
const router = express.Router();
const testEmailController = require('../controllers/testEmail.controller')
router.post('/verifyEmail',testEmailController.verifyEmail);
module.exports = router;

