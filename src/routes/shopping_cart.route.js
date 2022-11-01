const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shopping_cart.controller')
const auth = require('../helpers/auth')
const {checkNotAuthenticated} = require("../helpers/auth");

router.get('/',checkNotAuthenticated,shoppingCartController.getUserShoppingCart);


module.exports = router;

