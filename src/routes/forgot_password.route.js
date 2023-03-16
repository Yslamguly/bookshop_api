const express = require('express')
const router = express.Router()
const {forgotPassword} = require("../controllers/forgot_password.controller");
router.put('/forgot-password/:email',forgotPassword)
module.exports = router;
