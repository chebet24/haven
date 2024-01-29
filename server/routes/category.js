// categoryRoutes.js

const express = require('express');
const Category = require('../models/category'); // Import the Category model

const router = express.Router();

// Add a new category
router.post('/create', async (req, res) => {
  const { name, description } = req.body;

  try {
    // Check if a category with the same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with the same name already exists.' });
    }

    // If the category doesn't exist, create a new one
    const newCategory = new Category({ name, description, items: [] });
    const savedCategory = await newCategory.save();
    res.json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all categories
router.get('/all', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
