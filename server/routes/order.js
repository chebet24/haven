const express = require("express");
const router = express.Router();
const Order = require("../models/orders");
const Shop = require("../models/shop");
const Product = require("../models/products");

// create new order
router.post("/create-order", async (req, res, next) => {
  try {
    const { orderInfo, paymentInfo } = req.body;
    console.log("Request body:", req.body);

    // Ensure orderInfo and cart are available and cart is iterable
    if (!orderInfo || !orderInfo.cart || !Array.isArray(orderInfo.cart)) {
      throw new Error("Invalid order data");
    }

    const cart = orderInfo.cart;

    // Group cart items by shopId
    const shopItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    // Initialize shippingAddress, user, totalPrice
    const shippingAddress = orderInfo.shippingAddress;
    const user = orderInfo.user;
    const totalPrice = orderInfo.totalPrice;

    // Create an order for each shop
    const orders = [];

    for (const [shopId, items] of shopItemsMap) {
      const order = await Order.create({
        cart: items,
        shippingAddress,
        user,
        totalPrice,
        paymentInfo,
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});



  
// get all orders of user
router.get(
  "/get-all/:userId",
  async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  async (req, res, next) => {
    try {
      // Destructure seller and status from req.body
      const { seller, status } = req.body;

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found with this id",
        });
      }

      if (status === "Transferred to delivery partner") {
        // Use forEach loop with async/await
        await Promise.all(order.cart.map(async (o) => {
          await updateOrder(o._id, o.qty);
        }));
      }

      order.status = status;

      if (status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "Succeeded";
        const serviceCharge = order.totalPrice * 0.10;
        await updateSellerInfo(seller._id, order.totalPrice - serviceCharge);
      }

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock -= qty;
        product.sold_out += qty;

        await product.save({ validateBeforeSave: false });
      }

      async function updateSellerInfo(sellerId, amount) {
        const seller = await Shop.findById(sellerId);
        
        seller.availableBalance = amount;

        await seller.save();
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);


// give a refund ----- user
router.put(
  "/order-refund/:id",
  async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found with this id",
        });
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request successfully!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(400).json({
          success: false,
          message: "Order not found with this id",
        });
      }

      order.status = req.body.status;

      await order.save();

      res.status(200).json({
        success: true,
        message: "Order Refund successfull!",
      });

      if (req.body.status === "Refund Success") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);

        product.stock += qty;
        product.sold_out -= qty;

        await product.save({ validateBeforeSave: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
);

module.exports = router;
