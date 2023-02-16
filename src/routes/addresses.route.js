const express = require('express');
const addressesController = require('../controllers/addresses.controller')
const router = express.Router();
const {verifyToken} = require("../helpers/middlewares");


// router.post('/addAddress',checkNotAuthenticated,addressesController.addUserAddress);
router.get('/getUserAddresses',verifyToken,addressesController.getUserAddresses);
module.exports = router;
