const mongoose = require("mongoose");

//Creating a Book SChema
const BookSchema = mongoose.Schema({
  ISBN: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  }, //required
  title: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  pubDate: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  language: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  numPage: Number,
  authors: [Number],
  publications: Number,
  category: [String],
});
//Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;
