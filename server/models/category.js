// CategoryModel.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
//  items: [{ type: String }],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
