const express = require('express');
const addressesController = require('../controllers/addresses.controller')
const router = express.Router();
const {checkNotAuthenticated} = require("../helpers/middlewares");


router.post('/addAddress',checkNotAuthenticated,addressesController.addUserAddress);
router.get('/getUserAddresses',checkNotAuthenticated,addressesController.getUserAddresses);
module.exports = router;
