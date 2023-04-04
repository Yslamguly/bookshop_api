const express = require('express')
const router = express.Router();
const googleOauthController = require('../controllers/googleOauthController')

router.get('/google/url',googleOauthController.getGoogleOauthUrl);
router.get('/google/callback',googleOauthController.googleOauthCallback);

module.exports = router;
