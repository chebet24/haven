const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your product name!"],
  },
  description: {
    type: String,
    required: [true, "Please enter your product description!"],
  },
  categoryId: {
    type: String,
    required: [true, "Please select a category for your product!"],
  },
  originalPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
    min: [0, "Discount price must be a non-negative number."],
  },  
  stock: {
    type: Number,
    required: [true, "Please enter your product stock!"],
  },
  images: {
    type: [String], // Assuming storing image URLs
    required: true,
  },
  reviews: [
    {
      user: {
        type: Object,
      },
      rating: {
        type: Number,
      },
      comment: {
        type: String,
      },
      productId: {
        type: String,
      },
      createdAt:{
        type: Date,
        default: Date.now(),
      }
    },
  ],
  ratings: {
    type: Number,
  },
  shopId: {
    type: String,
    required: true,
  },
  shop: {
    type: Object,
    required: true,
  },
  sold_out: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
