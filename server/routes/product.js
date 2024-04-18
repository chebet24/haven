const express = require('express')
const router = express.Router()
const Product = require("../models/products");
const mongoose = require("mongoose");
const Order = require('../models/orders'); 

// Define the endpoint for creating a new product
router.post("/create", async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Define the endpoint for getting all products
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
;

// Get all products by shop id
router.get("/shop/:shopId", async (req, res) => {
  try {
    const shopId = req.params.shopId;
    console.log('Received shopId:', shopId);

    // Find all products with the specified shop ID
    const products = await Product.find({ shopId: shopId });
    console.log('Found products:', products);


    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for the given shop ID" });
    }

    res.json(products);
  } catch (error) {
    console.error('Error:', error.message);
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
router.get("/single/:productId", async (req, res) => {
  try {
    console.log('Product ID:', req.params.productId);
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
router.put("update/:productId", async (req, res) => {
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
router.delete("/delete/:productId", async (req, res) => {
  try {
    const productId = req.params.productId; // Extract productId from params
     // Log the productId
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.put("/create-new-review", async (req, res, next) => {
  try {
    const { user, rating, comment, productId, orderId } = req.body;
    console.log("req user",req.body.user)

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = {
      user,
      rating,
      comment,
      productId,
    };

    console.log("Product reviews:", product.reviews);
    const isReviewed = product.reviews.find((rev) => {
      console.log("Review user:", rev.user);
      return rev.user._id === req.body.user._id;
    });
    
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user._id === req.body.user._id) {
          rev.rating = rating;
          rev.comment = comment;
          rev.user = user;
        }
      });
    } else {
      product.reviews.push(review);
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    await Order.findByIdAndUpdate(
      orderId,
      { $set: { "cart.$[elem].isReviewed": true } },
      { arrayFilters: [{ "elem._id": productId }], new: true }
    );

    res.status(200).json({
      success: true,
      message: "Reviewed successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});


module.exports = router
