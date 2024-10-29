const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  author: { 
    type: String, 
    required: true, 
    trim: true 
  },
  genre: { 
    type: String, 
    required: true, 
    trim: true 
  },
  publicationDate: { 
    type: Date, 
    required: true 
  },
  availabilityStatus: { 
    type: String, 
    enum: ['Available', 'Borrowed'], 
    default: 'Available' 
  },
  edition: { 
    type: String 
  },
  summary: { 
    type: String 
  },
  borrowingHistory: [{
    borrowedBy: { type: String, required: true },
    borrowedDate: { type: Date, default: Date.now },
    returnDate: { type: Date, default: null },
  }]
}, { timestamps: true });




module.exports = mongoose.model('Book', bookSchema);
