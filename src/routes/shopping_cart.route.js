const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shopping_cart.controller')
const {checkNotAuthenticated} = require("../helpers/middlewares");

router.get('/',checkNotAuthenticated,shoppingCartController.getUserShoppingCart);
router.post('/addBook',checkNotAuthenticated,shoppingCartController.addBookToShoppingCart);
router.delete('/deleteBook',checkNotAuthenticated,shoppingCartController.deleteBookFromShoppingCart);
router.patch('/updateQuantity',checkNotAuthenticated,shoppingCartController.updateBookQuantity);

module.exports = router;

