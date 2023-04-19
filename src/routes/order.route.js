const express = require('express');
const router = express.Router();
const {verifyToken} = require("../helpers/middlewares");
const ordersController = require('../controllers/orders.controller')

router.post('/createOrder',verifyToken,ordersController.createShopOrder);
router.get('/getUserOrders/:customerId',verifyToken,ordersController.getUserOrders);
module.exports = router;

