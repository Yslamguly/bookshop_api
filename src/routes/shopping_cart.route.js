const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shopping_cart.controller')
const auth = require('../helpers/auth')
const {checkNotAuthenticated, checkAuthenticated} = require("../helpers/auth");

router.get('/',checkNotAuthenticated,shoppingCartController.getUserShoppingCart);
router.post('/addBook',checkNotAuthenticated,shoppingCartController.addBookToShoppingCart);
router.delete('/deleteBook',checkNotAuthenticated,shoppingCartController.deleteBookFromShoppingCart);

module.exports = router;

