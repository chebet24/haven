const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));

const connectDB = require("./db/database");
connectDB();

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

 
const server = app.listen(process.env.PORT);
const portNumber = server.address().port;
console.log(`Server is running on port ${portNumber}`);