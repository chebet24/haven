const express = require("express");
const router = express.Router();
const Shop = require("../models/shop");
const jwt = require("jsonwebtoken");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Choose the destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // Keep the original file name
  }
});



const upload = multer({ storage: storage });

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

    // Send the token and role in the response
    return res.json({ token, role: shop.role ,shop });
  } catch (error) {
    // Handle errors and send a single error response
    return res.status(500).json({ error: error.message });
  }
});


router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;

    // Check if the shop exists
    const shop = await Shop.findOne({ email }).select("-password");

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get/:_id", async (req, res) => {
  try {
    const id = req.params._id;
    console.log("Received ID:", id);

    // Check if the shop exists
    const shop = await Shop.findById(id).select("-password");

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ shop });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




// Route to get all shops
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
router.put('/update-shop-avatar', upload.single('avatar'), (req, res) => {
  try {
    // Check if file exists
    const { avatar } = req.body;

    // Check if avatar data is provided
    if (!avatar) {
      return res.status(400).json({ message: 'No avatar data provided' });
    }

    // Assuming you store the avatar data in your database
    // You can perform database update operations here
    // For now, we're just sending back a success message
    return res.status(200).json({ message: 'Avatar updated successfully', avatar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update-seller-info', async (req, res) => {
  try {
      const { name, description, address, phoneNumber, zipCode } = req.body;

      // Find the shop document and update it
      const updatedShop = await Shop.findOneAndUpdate({}, {
          name,
          description,
          address,
          phoneNumber,
          zipCode
      }, { new: true });

      // Send a success response with the updated shop document
      return res.status(200).json({ message: 'Shop info updated successfully', shop: updatedShop });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
