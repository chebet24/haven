const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "2FxXT1NTf2K1Mo4i6AOvtdI";

// Route for user registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phoneNumber, addresses } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ name, email, password, phoneNumber, addresses });
    await newUser.save();

    // Generate JWT token
    const token = newUser.getJwtToken();

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = user.getJwtToken();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/all", async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



    

// Route to get user profile
router.get("/profile", async (req, res) => {
  try {
    // Ensure authentication before reaching this endpoint
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
