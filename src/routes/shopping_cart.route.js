const express = require('express');
const router = express.Router();
const shoppingCartController = require('../controllers/shopping_cart.controller')
const {checkNotAuthenticated,verifyToken} = require("../helpers/middlewares");

router.get('/:customerId',verifyToken,shoppingCartController.getUserShoppingCart);
router.post('/addBook/:customerId',verifyToken,shoppingCartController.addBookToShoppingCart);
router.delete('/deleteBook/:customerId',verifyToken,shoppingCartController.deleteBookFromShoppingCart);
router.patch('/updateQuantity/:customerId',verifyToken,shoppingCartController.updateBookQuantity);
router.delete('/emptyShopping_cart/:customerId',verifyToken,shoppingCartController.emptyShoppingCart);
module.exports = router;

