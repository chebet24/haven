const express = require("express");
const router = express.Router();
const CoupounCode = require("../models/couponCode");

// Create a new coupon code
router.post("/create", async (req, res) => {
  try {
    const couponData = req.body;

    // Ensure shopId is present in the request body
   if (!couponData.shopId) {
      return res.status(400).json({ error: "Shop ID is required" });
    } 

    const newCoupon = await CoupounCode.create(couponData);
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all coupon codes
router.get("/allcodes", async (req, res) => {
  try {
    const couponCodes = await CoupounCode.find();
    res.json(couponCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific coupon code by ID
router.get("/:couponId", async (req, res) => {
  try {
    const couponCode = await CoupounCode.findById(req.params.couponId);
    if (!couponCode) {
      return res.status(404).json({ message: "Coupon code not found" });
    }
    res.json(couponCode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a specific coupon code by ID
router.put("/:couponId", async (req, res) => {
  try {
    const updatedCoupon = await CoupounCode.findByIdAndUpdate(
      req.params.couponId,
      req.body,
      { new: true }
    );
    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon code not found" });
    }
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a specific coupon code by ID
router.delete("/:couponId", async (req, res) => {
  try {
    const deletedCoupon = await CoupounCode.findByIdAndDelete(req.params.couponId);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon code not found" });
    }
    res.json({ message: "Coupon code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
