const bookModel = require('../models/bookModel');
const mongoose = require("mongoose");

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, publicationDate, edition, summary } = req.body;

    // Validation logic
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title is required and should be at least 3 characters long.' });
    }

    if (!author || typeof author !== 'string' || author.trim().length < 3) {
      return res.status(400).json({ message: 'Author is required and should be at least 3 characters long.' });
    }

    if (!genre || typeof genre !== 'string' || genre.trim().length < 3) {
      return res.status(400).json({ message: 'Genre is required and should be at least 3 characters long.' });
    }

    if (!publicationDate || isNaN(Date.parse(publicationDate))) {
      return res.status(400).json({ message: 'A valid publication date is required.' });
    }

    if (edition && (typeof edition !== 'string' || edition.trim().length < 1)) {
      return res.status(400).json({ message: 'Edition must be a valid string.' });
    }

    if (summary && summary.length > 1000) {
      return res.status(400).json({ message: 'Summary should not exceed 1000 characters.' });
    }

    // Check if the book already exists (based on title, author, and edition)
    const existingBook = await bookModel.findOne({ 
      title: title.trim(), 
      author: author.trim(), 
      edition: edition ? edition.trim() : null 
    });

    if (existingBook) {
      return res.status(409).json({ message: 'This book (with the same title, author, and edition) has already been added.' });
    }

    // If validation passes, create the new book
    const newBook = new bookModel({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      publicationDate,
      edition: edition ? edition.trim() : '',
      summary: summary ? summary.trim() : ''
    });

    await newBook.save();

    res.status(201).json({
      message: 'New book added successfully.',
      data: newBook
    });
  } catch (error) {
    res.status(500).json({
      message: `Failed to add book, ${error.message}`
    });
  }
};

  

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
      const books = await bookModel.find();
      res.status(200).json({
        totalNumberOfBooks: books.length,
        message: `All books retrieved successfully.`,
        data: books
      });
    } catch (error) {
      res.status(500).json({
        message: `Failed to retrieve books, ${error.message}` 
      });
    }
  };
  


// Get details of a specific book
exports.getBookById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the provided id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid book ID' });
      }
  
      const book = await bookModel.findById(id);
      if (!book){
        return res.status(404).json({ message: 'Book not found' });
      }
      else{
        res.status(200).json({
            message:`Book retrieved succesffully.`,
            data: book
        });
      }
  
      
    } catch (error) {
      res.status(500).json({ 
        message: `Failed to retrieve book, ${error.message}` 
    });
    }
  };


// Update a book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    // Validate fields to be updated
    const { title, author, genre, publicationDate, edition, summary } = req.body;

    if (title && (typeof title !== 'string' || title.trim().length < 3)) {
      return res.status(400).json({ message: 'Title must be at least 3 characters long' });
    }

    if (author && (typeof author !== 'string' || author.trim().length < 3)) {
      return res.status(400).json({ message: 'Author must be at least 3 characters long' });
    }

    if (genre && (typeof genre !== 'string' || genre.trim().length < 3)) {
      return res.status(400).json({ message: 'Genre must be at least 3 characters long' });
    }

    if (publicationDate && isNaN(Date.parse(publicationDate))) {
      return res.status(400).json({ message: 'A valid publication date is required' });
    }

    if (summary && summary.length > 1000) {
      return res.status(400).json({ message: 'Summary should not exceed 1000 characters' });
    }

    // Prepare fields for update 
    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (author) updatedFields.author = author;
    if (genre) updatedFields.genre = genre;
    if (publicationDate) updatedFields.publicationDate = publicationDate;
    if (edition) updatedFields.edition = edition;
    if (summary) updatedFields.summary = summary;

    // Find the book by ID and update the specified fields
    const book = await bookModel.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({
      message: 'Book updated successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to update book, ${error.message}` });
  }
};


// Delete a book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    // Find and delete the book by ID
    const book = await bookModel.findByIdAndDelete(id);
    if (!book){
        return res.status(404).json({ 
            message: 'Book not found' 
        });
    }

    res.status(200).json({
      message: `Book titled '${book.title}' has been deleted successfully.`
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to delete book, ${error.message}` });
  }
};



// Borrow a book
exports.borrowBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the provided id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    // Find the book by ID
    const book = await bookModel.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is available for borrowing
    if (book.availabilityStatus === 'Borrowed') {
      return res.status(400).json({ message: 'Book is currently unavailable for borrowing' });
    }

    // Record the borrowing event
    book.borrowingHistory.push({
      borrowedBy: req.body.borrowedBy || 'Unknown', // Set who borrowed the book
      borrowedDate: new Date(), // Set the current date as the borrowed date
      returnDate: req.body.returnDate || null, // Optionally set the expected return date from the request body
    });

    // Mark the book as borrowed
    book.availabilityStatus = 'Borrowed'; // Update the availability status

    await book.save();

    res.status(200).json({
      message: `Book '${book.title}' has been borrowed successfully.`,
      data: book
    });
  } catch (error) {
    res.status(500).json({ message: `Failed to borrow book, ${error.message}` });
  }
};

  

  
  // Return a book
  exports.returnBook = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the provided id is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid book ID' });
      }
  
      // Find the book by ID
      const book = await bookModel.findById(id);
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
  
      // Check if the book is already available
      if (book.availabilityStatus === 'Available') {
        return res.status(400).json({ message: 'Book is already available, no need to return' });
      }
  
      // Mark the book as returned
      book.availabilityStatus = 'Available'; // Update the availability status
  
      // Push the return event into the borrowingHistory
      const lastBorrowing = book.borrowingHistory[book.borrowingHistory.length - 1];
      if (lastBorrowing) {
        lastBorrowing.returnDate = new Date(); // Set the current date as the return date
      }
  
      await book.save();
  
      res.status(200).json({
        message: `Book '${book.title}' has been returned successfully.`,
        data: book
      });
    } catch (error) {
      res.status(500).json({ message: `Failed to return book, ${error.message}` });
    }
  };
  
  