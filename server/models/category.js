// CategoryModel.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  images: {
    type: [String], // Assuming storing image URLs
    required: true,
  },
//  items: [{ type: String }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
