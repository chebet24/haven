const express = require("express");
const path = require("path");
const multer = require('multer');
const app = express();
const cors = require("cors");
const cloudinary = require("cloudinary");
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));

const connectDB = require("./db/database");
connectDB();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middleware to parse JSON
app.use(express.json());







const product = require('./routes/product')
app.use("/product", product);

const user = require('./routes/user')
app.use("/user", user);

const shop = require('./routes/shop')
app.use("/shop", shop);

const events = require('./routes/events')
app.use("/event", events);

const discount= require('./routes/couponCode')
app.use("/discountcode", discount);

const categoryRouter = require ('./routes/category')
app.use("/category", categoryRouter);

const payment = require('./routes/payment')
app.use("/payment", payment);

const coupon = require ('./routes/couponCode')
app.use("/coupon", coupon);

const message = require ('./routes/messages')
app.use("/message",message);


const conversation = require ('./routes/conversation')
app.use("/conversation",conversation)


// const transactions =require('./routes/Transactions')
// app.use("/transactions",transactions)

const order = require ('./routes/order')
app.use("/order", order);

const group = require("./routes/group")
app.use("/group",group)


const server = app.listen(process.env.PORT);
const portNumber = server.address().port;
console.log(`Server is running on port ${portNumber}`);