const express = require("express");
const path = require("path");
const app = express()

const connectDB = require("./db/database");
connectDB();

// Middleware to parse JSON
app.use(express.json());


const product = require('./routes/product')
app.use("/product", product);

 
const server = app.listen(process.env.PORT);
const portNumber = server.address().port;
console.log(`Server is running on port ${portNumber}`);