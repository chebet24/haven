const express = require('express')
const router = express.Router()
const Product = require("../models/products");

// Define the endpoint for creating a new product
router.post("/", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define the endpoint for getting all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
;

// Get all products by shop name
router.get("/shop/:shop", async (req, res) => {
  try {
    const shop = req.params.shop;

    // Find all products with the specified shop name
    const products = await Product.find({ shop });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for the given shop name" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get by category
router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;

    // Find all products with the specified shop name
    const products = await Product.find({ category });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for the given category name" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define the endpoint for getting a specific product by ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define the endpoint for updating a specific product by ID
router.put("/:productId", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define the endpoint for deleting a specific product by ID
router.delete("/:productId", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router
