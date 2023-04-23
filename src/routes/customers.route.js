const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers.controller')


router.post('/register',customersController.register);
router.post('/login',customersController.login)
router.put('/:passwordResetCode/reset-password',customersController.resetPassword)
router.get('/getCustomerData/:customerId',customersController.getUserData)
module.exports = router;
