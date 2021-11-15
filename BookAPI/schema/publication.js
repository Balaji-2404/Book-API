const mongoose = require("mongoose");

//Publication Schema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 10,
  },
  books: [String],
});

//Publication Model

const PublicationModel = mongoose.model("publications", PublicationSchema);
module.exports = PublicationModel;
