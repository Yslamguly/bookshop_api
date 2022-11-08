const express = require('express');
const booksController = require('../controllers/books.controller')
const {paginatedBooks} = require('../helpers/middlewares')
const router = express.Router();


router.get('/',paginatedBooks(),booksController.getBooks);
router.get('/details',booksController.getBookById);
// router.get('/results',paginatedResults('bookstore.books'),booksController.getResults)
module.exports = router;
