const express = require('express');
const router = express.Router();
const testEmailController = require('../controllers/verify_email.controller')
router.post('/verifyEmail',testEmailController.verifyEmail);
module.exports = router;

