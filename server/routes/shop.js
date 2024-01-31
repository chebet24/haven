const express = require("express");
const router = express.Router();
const Shop = require("../models/shop");
const jwt = require("jsonwebtoken");

// Route for shop registration
// Route for shop registration
router.post("/createshop", async (req, res) => {
  try {
    // Check if the shop already exists
    const existingShop = await Shop.findOne({ email: req.body.email });
    if (existingShop) {
      return res.status(400).json({ message: "Shop already exists" });
    }

    // Create a new shop
    const newShop = await Shop.create(req.body);

    // Generate JWT token
    const token = newShop.getJwtToken();

    // Save the new shop
    await newShop.save();

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const shopId = req.params.id;

  try {
    const result = await Shop.deleteOne({ _id: shopId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for shop login
router.post('/loginshop', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the shop exists
    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Compare passwords
    const isPasswordMatch = await shop.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = shop.getJwtToken();

    // Send the token in the response
    return res.json({ token });
  } catch (error) {
    // Handle errors and send a single error response
    return res.status(500).json({ error: error.message });
  }
});
router.get("/all", async (req, res) => {
    try {
      // Retrieve all shops
      const shops = await Shop.find().select("-password");
  
      if (!shops || shops.length === 0) {
        return res.status(404).json({ message: "No shops found" });
      }
  
      res.json(shops);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Route to get shop profile
router.get("/profileshop", async (req, res) => {
  try {
    // Ensure authentication before reaching this endpoint
    const shopId = req.shop.id;

    // Find the shop by ID
    const shop = await Shop.findById(shopId).select("-password");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
