const express = require('express');
const booksController = require('../controllers/books.controller')
const {paginatedResults} = require('../helpers/middlewares')
const router = express.Router();


router.get('/',paginatedResults('bookstore.books'),booksController.getBooks);

module.exports = router;
