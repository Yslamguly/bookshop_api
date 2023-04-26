const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers.controller')
const {verifyToken} = require("../helpers/middlewares");


router.post('/register',customersController.register);
router.post('/login',customersController.login)
router.put('/:passwordResetCode/reset-password',customersController.resetPassword)
router.get('/getCustomerData/:customerId',verifyToken,customersController.getUserData)
router.put('/updateCustomerData/:customerId',verifyToken,customersController.updateUserData)

module.exports = router;
