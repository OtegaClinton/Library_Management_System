const express = require('express');
const bookRouter = express.Router();
const bookController = require('../controllers/bookController');


// Add a new book
bookRouter.post('/addbook', bookController.addBook);

// Retrieve all books
bookRouter.get('/books', bookController.getAllBooks);

// Get details of a specific book
bookRouter.get('/book/:id', bookController.getBookById);

// Update an existing book
bookRouter.put('/updatebook/:id', bookController.updateBook);

// Delete a book
bookRouter.delete('/deletebook/:id', bookController.deleteBook);

// Borrow and return routes
bookRouter.post('/books/:id/borrow', bookController.borrowBook); // Borrow a book

bookRouter.post('/books/:id/return', bookController.returnBook); // Return a book




module.exports = bookRouter;
