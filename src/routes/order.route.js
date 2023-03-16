const express = require('express');
const router = express.Router();
const {checkNotAuthenticated} = require("../helpers/middlewares");
const ordersController = require('../controllers/orders.controller')

router.post('/createOrder',checkNotAuthenticated,ordersController.createShopOrder)

module.exports = router;

