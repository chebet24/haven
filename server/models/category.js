// model.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  subcategories: [{
    name: String,
    description: String,
  }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
