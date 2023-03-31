const express = require('express')
const router = express.Router();
const googleOauthController = require('../controllers/googleOauthController')

router.get('/google/url',googleOauthController.getGoogleOauthUrl);


module.exports = router;
